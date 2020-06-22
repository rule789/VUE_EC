<template>
    <div>
         <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled': !pagination.has_pre}" @click.prevent="changePages(pagination.current_page -1)">
                <a class="page-link" href="#" aria-label="Previous" >
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                <li class="page-item" v-for="page in pagination.total_pages" :key="page" :class="{'active': page == pagination.current_page}" >
                    <a class="page-link" href="#" @click.prevent="changePages(page)">{{page}}</a>
                </li>
                <li class="page-item" :class="{'disabled': !pagination.has_next}" @click.prevent="changePages(pagination.current_page +1)">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>


<script>
export default {
    props: ['pagination'],
    methods: {
        changePages(page = 1){
            this.$emit('chagePage', page);
        }
    }
}
</script>