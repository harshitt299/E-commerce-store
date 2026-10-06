import React from 'react'

function Pagination({currentPage, totalPages,onPageChange}) {
    if(totalPages<=1)return null;
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "24px 0" }}>
        <button disabled = {currentPage<=1 } onClick = {()=>onPageChange(currentPage-1)}>Prev</button>
        <span> Page {currentPage} of {totalPages}</span>
        <button disabled = {currentPage>=totalPages} onClick={()=>onPageChange(currentPage+1)}>Next</button>
      
    </div>
  )
}

export default Pagination;
