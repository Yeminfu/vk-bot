"use client"
import React from 'react';
import ReactPaginate from 'react-paginate';



export default function Paginator(props: { page: number, pages: number }) {

    return <>
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={(v) => {

                window.location.href = `${window.location.origin}/${window.location.pathname}?page=${v.selected + 1}`

            }}
            forcePage={props.page - 1}
            pageRangeDisplayed={5}
            pageCount={props.pages}
            previousLabel="< previous"
            pageClassName='page-item'
            nextClassName='nextClassName'
            containerClassName='pagination'
            activeLinkClassName='activeLinkClassName'
            pageLinkClassName='page-link'
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextLinkClassName='page-link'
            activeClassName='active'
            renderOnZeroPageCount={null}
        />
    </>
}

