import React, { useState } from 'react';

const Table = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name'); // New state for search type

  const data = [
    { id: 1, name: 'Tata Consultancy Services (TCS)', link: 'https://www.tcs.com/careers', country: 'India' },
    { id: 2, name: 'Infosys', link: 'https://www.infosys.com/careers', country: 'India' },
    { id: 3, name: 'Wipro', link: 'https://www.wipro.com/careers', country: 'India' },
    { id: 4, name: 'HCL Technologies', link: 'https://www.hcltech.com/careers', country: 'India' },
    { id: 5, name: 'Tech Mahindra', link: 'https://www.techmahindra.com/careers', country: 'India' },
    { id: 6, name: 'Cognizant', link: 'https://www.cognizant.com/careers', country: 'United States' },
    { id: 7, name: 'Mindtree', link: 'https://www.mindtree.com/careers', country: 'India' },
    { id: 8, name: 'Oracle India', link: 'https://www.oracle.com/corporate/careers/', country: 'India' },
    { id: 9, name: 'Dell Technologies India', link: 'https://www.delltechnologies.com/en-us/careers', country: 'United States' },
    { id: 10, name: 'SAP India', link: 'https://www.sap.com/about/careers.html', country: 'Germany' },
    { id: 11, name: 'Google', link: 'https://careers.google.com', country: 'United States' },
    { id: 12, name: 'Microsoft', link: 'https://careers.microsoft.com', country: 'United States' },
    { id: 13, name: 'Amazon Web Services (AWS)', link: 'https://aws.amazon.com/careers/', country: 'United States' },
    { id: 14, name: 'IBM', link: 'https://www.ibm.com/employment', country: 'United States' },
    { id: 15, name: 'Apple', link: 'https://www.apple.com/careers/', country: 'United States' },
    { id: 16, name: 'Facebook (Meta)', link: 'https://www.metacareers.com/', country: 'United States' },
    { id: 17, name: 'Intel', link: 'https://jobs.intel.com/', country: 'United States' },
    { id: 18, name: 'Oracle', link: 'https://www.oracle.com/corporate/careers/', country: 'United States' },
    { id: 19, name: 'Salesforce', link: 'https://www.salesforce.com/company/careers/', country: 'United States' },
    { id: 20, name: 'Cisco', link: 'https://jobs.cisco.com/', country: 'United States' },
    { id: 21, name: 'SAP', link: 'https://www.sap.com/about/careers.html', country: 'Germany' },
    { id: 22, name: 'Siemens', link: 'https://new.siemens.com/global/en/company/jobs.html', country: 'Germany' },
    { id: 23, name: 'Deutsche Telekom', link: 'https://www.telekom.com/en/careers', country: 'Germany' },
    { id: 24, name: 'Infineon Technologies', link: 'https://www.infineon.com/cms/en/careers/', country: 'Germany' },
    { id: 25, name: 'Software AG', link: 'https://www.softwareag.com/corporate/company/careers', country: 'Germany' },
    { id: 26, name: 'T-Systems', link: 'https://www.t-systems.com/de/en/career', country: 'Germany' },
    { id: 27, name: 'Allianz Technology', link: 'https://www.allianz.com/en/careers/', country: 'Germany' },
    { id: 28, name: 'Fujitsu', link: 'https://www.fujitsu.com/global/about/careers/', country: 'Japan' },
    { id: 29, name: 'NEC', link: 'https://www.nec.com/en/global/careers/', country: 'Japan' },
    { id: 30, name: 'Canon', link: 'https://global.canon/en/career/', country: 'Japan' },
    { id: 31, name: 'Sony', link: 'https://www.sony.com/en/SonyInfo/Careers/', country: 'Japan' },
    { id: 32, name: 'Panasonic', link: 'https://www.panasonic.com/global/corporate/careers.html', country: 'Japan' },
    { id: 33, name: 'NTT Data', link: 'https://www.nttdata.com/global/en/careers/', country: 'Japan' },
    { id: 34, name: 'Hitachi', link: 'https://www.hitachi.com/careers/', country: 'Japan' },
    { id: 35, name: 'Accenture', link: 'https://www.accenture.com/us-en/careers', country: 'United States' },
    { id: 36, name: 'Capgemini', link: 'https://www.capgemini.com/careers/', country: 'France' },
    { id: 37, name: 'Atos', link: 'https://atos.net/en/careers', country: 'France' },
    { id: 38, name: 'NTT', link: 'https://www.ntt.com/en/about-us/careers.html', country: 'Japan' },
    { id: 39, name: 'Hewlett Packard Enterprise', link: 'https://www.hpe.com/us/en/careers.html', country: 'United States' },
    { id: 40, name: 'Alibaba Cloud', link: 'https://www.alibabacloud.com/careers', country: 'China' },
    { id: 41, name: 'Larsen & Toubro Ltd.', link: 'https://www.larsentoubro.com/corporate/careers/', country: 'India' },
    { id: 42, name: 'Reliance', link: 'https://careers.ril.com/rilcareers/', country: 'India' },
    { id: 43, name: 'Amazon', link: 'https://www.amazon.jobs/en/', country: 'United States' },
    { id: 44, name: 'Adani Group', link: 'https://careers.adani.com/', country: 'India' },
    { id: 45, name: 'Aditya Birla Group', link: 'https://careers.adityabirla.com/job-opportunities', country: 'India' },
    { id: 46, name: 'Hindustan Unilever Ltd', link: 'https://careers.unilever.com/india', country: 'India' },
    { id: 47, name: 'Avenue supermarts ltd', link: 'https://www.dmartindia.com/careers', country: 'India' },
    { id: 48, name: 'Titan Company Ltd.', link: 'https://careers.titan.co.in/Recruiting/candidates/candidates_home.aspx?rms=titan', country: 'India' },
    { id: 49, name: 'Nestle India Ltd.', link: 'https://www.nestle.in/jobs', country: 'India' },
    { id: 50, name: 'ITC Ltd.', link: 'https://www.itcportal.com/careers/index.aspx', country: 'India' },
    { id: 51, name: 'Tata Motors Ltd.', link: 'https://careers.tatamotors.com/', country: 'India' },
    { id: 52, name: 'Godrej Consumer Products Ltd.', link: 'https://www.godrejcareers.com/', country: 'India' },
    { id: 53, name: 'Dabur India Ltd.', link: 'https://www.dabur.com/amp/in/en-us/careers', country: 'India' },
    { id: 54, name: 'Britannia Industries Ltd.', link: 'http://britannia.co.in/careers/opportunities', country: 'India' },
    { id: 55, name: 'Asian Paints Ltd.', link: 'https://www.asianpaints.com/more/careers.html', country: 'India' },
    { id: 56, name: 'Infosys Ltd.', link: 'https://www.infosys.com/careers/apply.html', country: 'India' },
    { id: 57, name: 'HCL Technologies Ltd.', link: 'https://www.hcltech.com/careers', country: 'India' },
    { id: 58, name: 'Wipro Ltd.', link: 'https://careers.wipro.com/careers-home/', country: 'India' },
   
    { id: 59, name: 'Stripe', link: 'https://stripe.com/jobs', country: 'United States' },
    { id: 60, name: 'Square', link: 'https://squareup.com/us/en/talk/payments', country: 'United States' },
    { id: 61, name: 'PayPal', link: 'https://www.paypal.com/us/webapps/mpp/jobs', country: 'United States' },
    { id: 62, name: 'Plaid', link: 'https://plaid.com/careers/', country: 'United States' },
    { id: 63, name: 'Robinhood', link: 'https://robinhood.com/careers', country: 'United States' },
    { id: 64, name: 'Coinbase', link: 'https://www.coinbase.com/careers', country: 'United States' },
    { id: 65, name: 'UiPath', link: 'https://www.uipath.com/company/careers', country: 'United States' },
    { id: 66, name: 'Snowflake', link: 'https://www.snowflake.com/careers/', country: 'United States' },
    { id: 67, name: 'Twilio', link: 'https://www.twilio.com/company/jobs', country: 'United States' },
    { id: 68, name: 'Slack', link: 'https://slack.com/careers', country: 'United States' },
    { id: 69, name: 'Nvidia', link: 'https://www.nvidia.com/en-us/about-nvidia/careers/', country: 'United States' },
    { id: 70, name: 'ServiceNow', link: 'https://www.servicenow.com/careers.html', country: 'United States' },
    { id: 71, name: 'Palantir Technologies', link: 'https://www.palantir.com/careers/', country: 'United States' },
    { id: 72, name: 'Databricks', link: 'https://databricks.com/careers', country: 'United States' },
    { id: 73, name: 'Elastic', link: 'https://www.elastic.co/about/careers', country: 'United States' },
    { id: 74, name: 'Coupa Software', link: 'https://www.coupa.com/company/careers/', country: 'United States' },
    { id: 75, name: 'Zebra Technologies', link: 'https://www.zebra.com/us/en/about-zebra/careers.html', country: 'United States' },
    { id: 76, name: 'HubSpot', link: 'https://www.hubspot.com/careers', country: 'United States' },
    { id: 77, name: 'Atlassian', link: 'https://www.atlassian.com/company/careers', country: 'Australia' },
    { id: 78, name: 'DocuSign', link: 'https://www.docusign.com/company/careers', country: 'United States' },
    { id: 79, name: 'Freshworks', link: 'https://www.freshworks.com/careers/', country: 'India' },
    { id: 80, name: 'ThoughtSpot', link: 'https://www.thoughtspot.com/careers', country: 'United States' },
    { id: 81, name: 'GitHub', link: 'https://github.com/about/careers', country: 'United States' },
    { id: 82, name: 'Asana', link: 'https://asana.com/jobs', country: 'United States' },
    { id: 83, name: 'SAP SE', link: 'https://www.sap.com/about/careers.html', country: 'Germany' },
    { id: 84, name: 'Daimler', link: 'https://www.daimler.com/careers/', country: 'Germany' },
    { id: 85, name: 'Volkswagen', link: 'https://www.volkswagenag.com/en/careers.html', country: 'Germany' },
    { id: 86, name: 'Ericsson', link: 'https://www.ericsson.com/en/careers', country: 'Sweden' },
    { id: 87, name: 'Nokia', link: 'https://www.nokia.com/about-us/careers/', country: 'Finland' },
    { id: 88, name: 'Siemens Healthineers', link: 'https://www.siemens-healthineers.com/en-us/careers', country: 'Germany' },
    { id: 89, name: 'KLA Corporation', link: 'https://www.kla-tencor.com/careers', country: 'United States' },
    { id: 90, name: 'Qualcomm', link: 'https://www.qualcomm.com/careers', country: 'United States' },
    { id: 91, name: 'Sony Music Entertainment', link: 'https://www.sonymusic.com/careers/', country: 'United States' },
    { id: 92, name: 'Ericsson', link: 'https://www.ericsson.com/en/careers', country: 'Sweden' },
    { id: 93, name: 'Telenor', link: 'https://www.telenor.com/careers/', country: 'Norway' },
    { id: 94, name: 'Samsung Electronics', link: 'https://www.samsung.com/us/careers/', country: 'South Korea' },
    { id: 95, name: 'LG Electronics', link: 'https://www.lg.com/global/careers', country: 'South Korea' },
    { id: 96, name: 'Huawei', link: 'https://career.huawei.com/reccampportal/portal5/index.html', country: 'China' },
    { id: 97, name: 'Lenovo', link: 'https://www.lenovo.com/us/en/careers/', country: 'China' },
    { id: 98, name: 'Alibaba Group', link: 'https://www.alibabagroup.com/en/global/careers', country: 'China' },
    { id: 99, name: 'JD.com', link: 'https://jd.com/careers', country: 'China' },
    { id: 100, name: 'BYD', link: 'https://www.byd.com/en/careers.html', country: 'China' }
    ];
  

  const filteredData = data.filter(item => {
    const term = searchTerm.toLowerCase();
    if (searchType === 'name') {
      return item.name.toLowerCase().includes(term);
    } else if (searchType === 'country') {
      return item.country.toLowerCase().includes(term);
    }
    return false;
  });


  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto max-w-full sm:max-w-5xl mt-3">
      <div className="pb-4 bg-white dark:bg-gray-900 flex flex-col sm:flex-row sm:justify-between gap-4 p-4">
        <label htmlFor="searchType" className="sr-only">Search By</label>
        <select
          id="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 py-2 px-3 w-full sm:w-1/4"
        >
          <option value="name">Search by Company Name</option>
          <option value="country">Search by Country Name</option>
        </select>
        
        <div className="relative w-full sm:w-3/4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block pl-10 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={`Search for ${searchType === 'name' ? 'company name' : 'country name'}`}
          />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-2">SNo.</th>
            <th scope="col" className="px-4 py-2">Country</th>
            <th scope="col" className="px-4 py-2">Company Name</th>
            <th scope="col" className="px-4 py-2">Career Page Link</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.country}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">
                <a href={item.link} className="text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  {item.link}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;