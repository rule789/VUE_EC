<template>
    <div>
        <Navbar></Navbar>
        <AlertMsng></AlertMsng>
        <div class="container-fluid">
            <div class="row">
                <Sidebar></Sidebar>
                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <router-view></router-view>
                </main>
            </div>
        </div>
        
    </div>
</template>

<script>
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import AlertMsng from './AlertMsng'

export default {
    components: {
        Navbar,
        Sidebar,
        AlertMsng
    }
}
</script>