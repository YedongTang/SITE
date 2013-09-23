
This is a list of expected functionality within the web application.

<tr>
<td></td>
<td></td>
<td></td>
</tr>
<table boarder=1>

<tr>
<td><b>Item</b></td>
<td><b>Name</b></td>
<td><b>Test Case</b></td>
<td><b>Description</b></td>
</tr>


<tr>
 <td>1</td>
 <td>1.1 ProviderInformationQueryRequestTestSuite</td>
 <td>search_provider_by_name </td>
 <td>Basic search for Provider by givenName attribute.</td>
</tr>



<tr>
    <td>2</td>
    <td>1.2 ProviderInformationQueryRequestTestSuite</td>
    <td>search_org_by_id</td>
    <td>Basic search for Organization by hpdOrgId attribute</td>
</tr>

<tr>
    <td>3</td>
	<td>1.3 ProviderInformationQueryRequestTestSuite</td>
	<td>search_membership_by_provider</td>
    <td>Basic search for Organization by hpdOrgId attribute</td>
</tr>

<tr>
    <td>4</td>
    <td>1.4 ProviderInformationQueryRequestTestSuite </td>
    <td>search_service_by_id</td>
     <td>Basic search for Service by hpdServiceId attribute</td>
</tr>


<tr>
    <td>5</td>
<td> 1.5 ProviderInformationQueryRequestTestSuite</td>
<td>search_credential_by_id</td>
<td>Basic search for Credential by hpdCredentialId attribute</td>
</tr>

<tr>
    <td>6</td>
<td>2.1 Workflows</td>
<td>WSC_1</td>
<td>Retrieve Provider, then associated ESI</td>

</tr>


<tr>
    <td>7</td>
<td>2.2 Workflows</td>
<td>WSC_2_and_IWG</td>
<td>Retrieve Organization, then associated Providers, then associated ESI</td>
</tr>


<tr>
    <td>8</td>
<td>2.3 Workflows</td>
<td>WSC_3</td>
<td>Retrieve Provider, then associated Organization, then associated ESI</td>
</tr>


<tr>
    <td>9</td>
<td>3.1 Message_Compliance</td>
<td>RequestIDs_Equal</td>
<td>Asserts that requestID in the request is equal to the requestIDs returned in the response</td>
</tr>

<tr>
    <td>10</td>
<td>3.2 Message_Compliance </td>
<td>Unallowed_Metadata</td>
<td>Error case in which an bad metadata property element is in the request</td>
</tr>

<tr>
    <td>11</td>
<td>3.3 Message_Compliance</td>
<td>Allowed_Metadata</td>
<td>All allowed metadata are in the request, and asserts that they are returned in the response.</td>
</tr>


<tr>
<td>12</td>
<td>4.1 Federation </td>
<td>federation_loop_test</td>
<td>Induces a federation loop and detects the duplicate requestID.</td>
</tr>


<tr>
<td>13</td>
<td>6.1 Requirement_6</td>
<td>Find_Individual
</td>
<td>Request a list of individuals by specifying one or more
individual attributes.
</td>
</tr>


<tr>
<td>14</td>
<td>6.2 Requirement_6</td>
<td>Find_Unique_Individual</td>
<td>Request a specific individual by specifying the individual
unique reference ID.</td>
</tr>


<tr>
<td>15</td>
<td>6.3 Requirement_6</td>
<td>Find_Organization</td>
<td>Request a list of organizations and relationships to
other organizations by specifying one or more
organization attributes.
</td>
</tr>


<tr>
<td>16</td>
<td>6.4 Requirement_6</td>
<td>Find_Unique_Organization
</td>
<td>Request a specific organization and relationships to
other organizations by specifying the organization
unique reference ID.
</td>
</tr>

<tr>
<td>17</td>
<td>6.5 Requirement_6</td>
<td>Find_Organizations_for_Unique_Individual</td>
<td>Request a specific individual and related organizations
by specifying an individual unique reference ID and one
or more attributes of organizations. Organizations and
relationships to the specified individual are returned
when the organization matches the organization
attributes and has a relationship to the individual
specified. Attributes on the relationship between the
individual and organization can also be specified in this
query and further constrain which organizations and
relationships are returned.</td>
</tr>

<tr>
<td>18</td>
<td>6.6 Requirement_6</td>
<td> Find_Individuals_for_Unique_Organization</td>
<td>
Request a specific organization and related individuals
by specifying an organization unique reference ID and
one or more attributes of individuals. Individuals and
relationships to the specified organization are returned
when the individual matches the individual attributes
and has a relationship to the organization specified.
Attributes on the relationship between the individual
and organization can also be specified in this query and
further constrain which individuals and relationships
are returned.
</td>
</tr>


<tr>
<td>19</td>
<td>6.7 Requirement_6</td>
<td>Find_Individuals_for_Unique_Organization</td>
<td>Request a list of individuals, organizations and
relationships between (individuals/organizations or
organization/organization) based on attributes of
individuals, organizations, and individuals/organization
relationships. Response includes all objects (whether
individual, organization or relationship) where the
individuals match all of the individual attributes
specified, the organizations match all of the
organization attributes and where a relationship exists
between each individual and one or more organizations
returned. In the event the query includes one or more
attributes regarding the relationship, then each
relationship returned must match all the attributes
specified. For each organization returned, all its
relationships, as parent or child, with other
organizations are returned.
</td>
</tr>


<tr>
<td>20</td>
<td>7.3 Requirement_7 </td>
<td>Retrieve_Service_via_Membership</td>
<td>Retrieve Membership, then associated ESI</td>
</tr>


<tr>
<td>21</td>
<td>20.1 Client Test Script</td>
<td>Find Provider Plus</td>
<td>Request a Provider with sn set to "Jones".</td>
</tr>

<tr>
<td>22</td>
<td>>20.2 Client Test Script</td>
<td>Find Organization Plus</td>
<td>Request an Organization with hpdOrgId set to "org1".</td>
</tr>


<tr>
<td>23</td>
<td>>20.3 Client Test Script</td>
<td>Find Credential Plus </td>
<td>Request a Credential with hpdCredentialId set to "2".</td>
</tr>

<tr>
<td>24</td>
<td>>20.4 Client Test Script</td>
<td>Find Membership Plus </td>
<td>Request a Membership with hpdMemberId set to "1". </td>
</tr>

<tr>
<td>25</td>
<td>>20.5 Client Test Script</td>
<td>Find Service Plus</td>
<td>Request a Service with hpdServiceId set to "1". Use new Mod Spec WSDL </td>
</tr>

<tr>
<td>26</td>
<td>>20.6 Client Test Script</td>
<td>Bad Filter Plus </td>
<td>Request a Provider with sn set to "non_existant_sn". </td>
</tr>

<tr>
<td>27</td>
<td>>20.7 Client Test Script</td>
<td>Duplicate Request ID Plus </td>
<td>Two requests with identical requestIDs trigger an error.</td>
</tr>

<tr>
<td>28</td>
<td>30.1 Installation Test Script</td>
<td>30.1 Installation Test Script</td>
<td>Source code installation of MSPDTI and smoke test.</td>
</tr>

</table>


