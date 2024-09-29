import React, { useState } from 'react';

const Table = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name'); // New state for search type

  const data = [
    { name: 'John Doe', category: 'Gym', startDate: '2024-01-01', endDate: '2025-01-01', status: 'Active' },
    { name: 'Jane Smith', category: 'Yoga', startDate: '2024-02-01', endDate: '2024-12-01', status: 'Active' },
    { name: 'Mike Johnson', category: 'Gym', startDate: '2023-05-15', endDate: '2024-05-15', status: 'Expired' },
    { name: 'Emily Davis', category: 'Yoga', startDate: '2023-09-01', endDate: '2024-09-01', status: 'Expired' },
    { name: 'David Wilson', category: 'Zumba', startDate: '2024-03-01', endDate: '2025-03-01', status: 'Active' },
    { name: 'Sarah Brown', category: 'Yoga', startDate: '2024-04-01', endDate: '2025-04-01', status: 'Active' },
    { name: 'Chris Lee', category: 'Gym', startDate: '2023-06-01', endDate: '2024-06-01', status: 'Expired' },
    { name: 'Anna Garcia', category: 'Zumba', startDate: '2024-01-15', endDate: '2025-01-15', status: 'Active' },
    { name: 'Kevin Martinez', category: 'Gym', startDate: '2023-11-01', endDate: '2024-11-01', status: 'Expired' },
    { name: 'Laura Hernandez', category: 'Yoga', startDate: '2024-05-01', endDate: '2025-05-01', status: 'Active' },
    { name: 'Mark Anderson', category: 'Gym', startDate: '2023-08-15', endDate: '2024-08-15', status: 'Expired' },
    { name: 'Sophia Thomas', category: 'Zumba', startDate: '2024-06-01', endDate: '2025-06-01', status: 'Active' },
    { name: 'Anna Garcia', category: 'Zumba', startDate: '2024-01-15', endDate: '2025-01-15', status: 'Active' },
    { name: 'Kevin Martinez', category: 'Gym', startDate: '2023-11-01', endDate: '2024-11-01', status: 'Expired' },
    { name: 'Laura Hernandez', category: 'Yoga', startDate: '2024-05-01', endDate: '2025-05-01', status: 'Active' },
    { name: 'Mark Anderson', category: 'Gym', startDate: '2023-08-15', endDate: '2024-08-15', status: 'Expired' },
    { name: 'Sophia Thomas', category: 'Zumba', startDate: '2024-06-01', endDate: '2025-06-01', status: 'Active' },
    { name: 'Mike Johnson', category: 'Gym', startDate: '2023-05-15', endDate: '2024-05-15', status: 'Expired' },
    { name: 'Emily Davis', category: 'Yoga', startDate: '2023-09-01', endDate: '2024-09-01', status: 'Expired' },
    { name: 'David Wilson', category: 'Zumba', startDate: '2024-03-01', endDate: '2025-03-01', status: 'Active' },
    { name: 'Sarah Brown', category: 'Yoga', startDate: '2024-04-01', endDate: '2025-04-01', status: 'Active' },
    { name: 'Chris Lee', category: 'Gym', startDate: '2023-06-01', endDate: '2024-06-01', status: 'Expired' },
    { name: 'Anna Garcia', category: 'Zumba', startDate: '2024-01-15', endDate: '2025-01-15', status: 'Active' }
  ];

  const filteredData = data.filter(item => {
    const term = searchTerm.toLowerCase();
    if (searchType === 'name') {
      return item.name.toLowerCase().includes(term);
    } else if (searchType === 'country') {
      return item.country && item.country.toLowerCase().includes(term);
    }
    return false;
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
      <div className="pb-4 bg-white dark:bg-gray-900 flex flex-col sm:flex-row sm:justify-between gap-4 p-4">
        {/* <label htmlFor="searchType" className="sr-only">Search By</label> */}
        {/* <select
          id="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 py-2 px-3 w-full sm:w-1/4"
        >
          <option value="name">Search by Company Name</option>
          <option value="country">Search by Country Name</option>
        </select> */}

        {/* <div className="relative w-full sm:w-3/4">
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
        </div> */}
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-2">Name</th>
            <th scope="col" className="px-4 py-2">Type</th>
            <th scope="col" className="px-4 py-2">Start Date</th>
            <th scope="col" className="px-4 py-2">End Date</th>
            <th scope="col" className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={item.status === 'Active' ? 'bg-green-100' : 'bg-red-100'}>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.category}</td>
              <td className="px-4 py-2">{item.startDate}</td>
              <td className="px-4 py-2">{item.endDate}</td>
              <td className="px-4 py-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
