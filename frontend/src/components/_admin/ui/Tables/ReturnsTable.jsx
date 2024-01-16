import React from 'react'

const ReturnsTable = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default max-w-full overflow-x-auto  dark:border-strokedark dark:bg-boxdark">
    <div className="w-full overflow-x-auto">
      <table class="table-auto">
        <thead>
          <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
          </tr>
          <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
          </tr>
          <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default ReturnsTable