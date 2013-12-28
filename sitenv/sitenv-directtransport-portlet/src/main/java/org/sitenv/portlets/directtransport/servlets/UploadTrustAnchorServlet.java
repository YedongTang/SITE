package org.sitenv.portlets.directtransport.servlets;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.Security;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Appender;
import org.apache.log4j.FileAppender;
import org.apache.log4j.Logger;
import org.bouncycastle.asn1.ASN1InputStream;
import org.bouncycastle.asn1.DEROutputStream;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMReader;
import org.nhindirect.trustbundle.core.CreateUnSignedPKCS7;
import org.sitenv.common.utilities.servlet.SiteBaseServlet;
import org.sitenv.portlets.directtransport.models.GenericResult;

import com.google.gson.Gson;


public class UploadTrustAnchorServlet extends SiteBaseServlet {
	
	private static final long serialVersionUID = 1L;
	
	private static Logger _log = Logger.getLogger(UploadTrustAnchorServlet.class);
	
	private static final int THRESHOLD_SIZE = 1024 * 1024 * 3;    // 3MB
	private static final int MAX_FILE_SIZE = 1024 * 1024 * 10;    // 10MB 
	private static final int REQUEST_SIZE = 1024 * 1024 * 11;    // 11MB
	
	
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		if (this.props == null)
		{
			this.loadProperties();
		}
		
		_log.trace("Start responding to get request.");
		PrintWriter out = response.getWriter();
		
		String uploadAnchorFileDir = props.getProperty("trustAnchorDir"); 
		String trustBundleFile = props.getProperty("trustBundleFile");
		String msg = String.format("<p>Upload certificate service 1.0 is running...</p><br/>Anchor upload folder:%s<br/>Trust bundle file path:%s" , 
			    		uploadAnchorFileDir, 
			    		trustBundleFile);
		out.println(msg);
		
		Enumeration e = Logger.getRootLogger().getAllAppenders();
	    while ( e.hasMoreElements() ){
	      Appender app = (Appender)e.nextElement();
	      if ( app instanceof FileAppender ){
	        System.out.println("File: " + ((FileAppender)app).getFile());
	      }
	    }
		
		_log.trace("End responding to get request.");
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		if (this.props == null)
		{
			this.loadProperties();
		}
		
		_log.trace("start recieving the anchor file.");
		
		GenericResult result = new GenericResult();
		
		String uploadAnchorFileDir = props.getProperty("trustAnchorDir"); 
		String trustBundleFile = props.getProperty("trustBundleFile");
		
		
		if(!ServletFileUpload.isMultipartContent(request)) 
		{
			_log.trace("Not a multipart request.");
			
			result.setIsSuccess(false);
			result.setErrorMessage("Not a valid request.");
		}
		else
		{
			_log.trace("prepare to receive the anchor file.");
			
			org.apache.commons.fileupload.disk.DiskFileItemFactory factory = 
					new org.apache.commons.fileupload.disk.DiskFileItemFactory();
			factory.setSizeThreshold(THRESHOLD_SIZE);
			factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
			
			org.apache.commons.fileupload.servlet.ServletFileUpload upload = 
					new org.apache.commons.fileupload.servlet.ServletFileUpload(factory);
			upload.setFileSizeMax(MAX_FILE_SIZE);
			upload.setSizeMax(REQUEST_SIZE);
			
			List<FileItem> items;
			Boolean uploadSuccess = false;
			String savedFilePath = null;
			String errorMsg = null;
			
			try {
		    	
				_log.trace("extracting the anchor file.");
				
		    	items = upload.parseRequest(request);
				Iterator<FileItem> iter = items.iterator();
			
				while (iter.hasNext()) {
					
					FileItem item = (FileItem) iter.next();
					
					//data not related to an uploaded file
					if (!item.isFormField()) {
						//get the name of the file.
						String fileName = new File(item.getName()).getName();
						byte[] file = IOUtils.toByteArray(item.getInputStream());
						
						ByteArrayInputStream stream = new ByteArrayInputStream(file);
						InputStreamReader streamReader = new InputStreamReader(stream);
						BufferedReader reader = new BufferedReader(streamReader);
						
						String firstLine = reader.readLine();
						
						if(firstLine.equalsIgnoreCase("-----BEGIN CERTIFICATE-----"))
						{
							Security.addProvider(new BouncyCastleProvider());

							stream = new ByteArrayInputStream(file);
							streamReader = new InputStreamReader(stream);
							
							PEMReader r = new PEMReader(streamReader);
							X509Certificate certObj = (X509Certificate) r
									.readObject();

							byte[] tempBytes = certObj.getEncoded();
							ASN1InputStream in = new ASN1InputStream(tempBytes); 
						    ByteArrayOutputStream bOut = new ByteArrayOutputStream(); 
						    DEROutputStream dOut = new DEROutputStream(bOut); 
						    dOut.writeObject(in.readObject()); 
						    byte[] derData = bOut.toByteArray(); 
						    
						    r.close();
						    in.close();
						    dOut.close();
						    
						    savedFilePath = uploadAnchorFileDir + File.separator + FilenameUtils.getName(fileName) +  ".der";
						    
							FileOutputStream fos = new FileOutputStream(savedFilePath);
							fos.write(derData);
							fos.close();
							
							fileName = new File(FilenameUtils.getPath(fileName) + FilenameUtils.getName(fileName) + ".der").getName();
						} 
						else
						{
							// we need to check if the BouncyCastle provider is already installed
					        // before installing it
					        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
					            Security.addProvider(new BouncyCastleProvider());
					        }
					        
							CertificateFactory cf = CertificateFactory.getInstance("X.509", "BC");
							X509Certificate x509cert = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(file));
							
							if (x509cert != null)
							{
								_log.trace(String.format("file uploaded %s", fileName));
								savedFilePath = uploadAnchorFileDir + File.separator + fileName;
								File storeFile = new File(savedFilePath);
								item.write(storeFile);
							}
							else
							{
								throw new Exception("Certificates must be in binary or base64 encoded X.509 format.");
							}
						} 
						
					}
				}
				_log.info(String.format("Anchor file uploaded to %s", savedFilePath));
				
				uploadSuccess = true;
				
			} catch (FileUploadException e) {
				if(e.getMessage().endsWith("bytes.")) {
					errorMsg = "Maxiumum file size exceeeded. " +  
								"Please return to the previous page and select a file that is less than "
								+ MAX_FILE_SIZE / 1024 / 1024 + "MB(s).";
				} else {
					errorMsg = "There was an error uploading the file: " + e.getMessage();
				}
				_log.error(errorMsg, e);
			} catch (Exception e) {
				errorMsg = "Failed to upload your certificate due to error: " + e.getMessage();
				_log.error(errorMsg, e);
			}
			
			if(uploadSuccess)
			{
				try {
					String bundleGenRsltStr = GenTrustBundle(uploadAnchorFileDir,trustBundleFile);
					_log.trace(bundleGenRsltStr);
					
					if(bundleGenRsltStr.contains("Bundle Creation Failed")){
						//delete the uploaded file;
						FileUtils.forceDelete(new File(savedFilePath));
						errorMsg = "Failed to include the certificate into the bundle, please verify the format of the anchor file uploaded.";
					}
					
					_log.info("Trust bundle generated at:" + trustBundleFile);
				} catch (ClassNotFoundException e) {
					errorMsg = e.getMessage();
					_log.error("Failed to generate the trustbundle", e);
				}
				
				if(errorMsg!=null)
				{
					result.setIsSuccess(false);
					result.setErrorMessage(errorMsg);
				}
				else
				{
					result.setIsSuccess(true);
					result.setErrorMessage("Upload succeeded, it may take up to five minutes for the server to receive your trust anchor.(Click to hide this message)");
				}
			}
			else
			{
				result.setIsSuccess(false);
				result.setErrorMessage(errorMsg);
			}
		}
		
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
	    String json = gson.toJson(result);
	    out.println(json);
	    
	    _log.trace("generated payload:"+json);
	    _log.trace("respond to certificate upload completed.");
	}
	
	public static synchronized String GenTrustBundle(String anchorDir, String bundleFilePath) throws ClassNotFoundException{
		//make sure the class loaded by jvm.
		Class.forName("org.nhindirect.trustbundle.core.CreateUnSignedPKCS7");
		CreateUnSignedPKCS7 generator = new CreateUnSignedPKCS7();
		File file = new File(bundleFilePath);
		_log.trace("folder:" + file.getParent());
		_log.trace("filename:" + file.getName());
		return generator.getParameters(anchorDir, "Select Meta Data File" , file.getParent(), file.getName());
	} 

}
