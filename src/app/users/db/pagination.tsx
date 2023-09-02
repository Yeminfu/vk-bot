"use client"
import React, { useState } from 'react';
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
            // previousLinkClassName='page-link'
            renderOnZeroPageCount={null}
        />
        {/* <PaginatedItems itemsPerPage={4} />, */}
    </>
}



// Example items, to simulate fetching from another resources.
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function Items({ currentItems }: any) {
    return (
        <>
            {currentItems &&
                currentItems.map((item: any) => (
                    <div>
                        <h3>Item #{item}</h3>
                    </div>
                ))}
        </>
    );
}

function PaginatedItems({ itemsPerPage }: any) {
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    return (
        <>
            <Items currentItems={currentItems} />
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            />
        </>
    );
}