import React, { Component } from 'react';
import { dictionary } from '../utils/dictionary';
import '../../css/pagination.css'

class Pagination extends Component {
  constructor() {
     super();
     this.state = {
       currentPage: 1
     };
     this.handleClick = this.handleClick.bind(this);
   }

   handleClick(event) {
     this.setState({
       currentPage: Number(event.target.id)
     });
   }

   render() {
     const { currentPage } = this.state;
     const { items, itemsPerPage } = this.props

     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

     // Logic for displaying page numbers
     const pageNumbers = [];
     for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
       pageNumbers.push(i);
     }

     function activePage(page) {
       if (page === currentPage) return 'active'
     }

     const renderPageNumbers = pageNumbers.map(number => {
       if(number-3 < currentPage && number+3 > currentPage) {
         return (
           <li key={number} id={number} onClick={this.handleClick} className={activePage(number)}>
              {number}
              </li>
            );
          }
      else return null;
     });

     return (
       <div>
         <ul className='list-group'>
           {currentItems}
         </ul>
         {pageNumbers.length>1 && <ul className='pagination'>
            <li key='-1' id='1' onClick={this.handleClick}>
              {dictionary.pagination.first}
            </li>
           {renderPageNumbers}
           <li key='100000' id={pageNumbers[pageNumbers.length-1]} onClick={this.handleClick}>
             {dictionary.pagination.last} ({pageNumbers[pageNumbers.length-1]})
           </li>
         </ul>}
       </div>
     );
   }
 }

export default Pagination
