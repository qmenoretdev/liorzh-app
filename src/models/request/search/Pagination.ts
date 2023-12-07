export interface Pagination {
    /**
     * Page number
     */
    cursor: number;
    /**
     * Total of items
     */
    total: number;
    /**
     * Total of pages
     */
    pages: number;
    /**
     * Number of items return
     */
    items: number;
    /**
     * Max item number per page
     */
    limit: number | null;
}