<template>
    <div>
        <loading :active.sync="isLoading" 
        ></loading>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
        </div>
        <div>
            <table class="table mt-4">
                <thead>
                    <tr>
                        <th width="120">分類</th>
                        <th>產品名稱</th>
                        <th width="120">原價</th>
                        <th width="120">售價</th>
                        <th width="100">是否啟用</th>
                        <th width="120">編輯</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in products" :key="item.id">
                        <td>{{item.category}}</td>
                        <td>{{item.title}}</td>
                        <td class="text-right">{{item.origin_price | currencyDollar}}</td>
                        <td class="text-right">{{item.price | currencyDollar}}</td>
                        <td>
                            <span v-if="item.is_enabled" class="text-success">啟用</span>
                            <span v-else>未啟用</span>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                                <button class="btn btn-outline-danger btn-sm" @click="openDelProModal(item)">刪除</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Pagination :pagination="pagination" @chagePage="getProducts"></Pagination>

            <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>新增產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                            <label for="image">輸入圖片網址</label>
                            <input type="text" class="form-control" id="image"
                                placeholder="請輸入圖片連結" v-model="templatePro.imageUrl">
                            </div>
                            <div class="form-group">
                                <label for="customFile">或 上傳圖片
                                    <i class="fas fa-spinner fa-spin" v-if="status.uploadImg"></i>
                                </label>
                                <input type="file" id="customFile" class="form-control"
                                ref="files" @change="uploadImg">
                            </div>
                            <img :src="templatePro.imageUrl" class="img-fluid" alt="">
                        </div>
                        <div class="col-sm-8">
                            <div class="form-group">
                            <label for="title">標題</label>
                            <input type="text" class="form-control" id="title"
                                placeholder="請輸入標題" v-model="templatePro.title">
                            </div>

                            <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="category">分類</label>
                                <input type="text" class="form-control" id="category"
                                placeholder="請輸入分類" v-model="templatePro.category">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">單位</label>
                                <input type="unit" class="form-control" id="unit"
                                placeholder="請輸入單位" v-model="templatePro.unit">
                            </div>
                            </div>

                            <div class="form-row">
                            <div class="form-group col-md-6">
                            <label for="origin_price">原價</label>
                                <input type="number" class="form-control" id="origin_price"
                                placeholder="請輸入原價" v-model="templatePro.origin_price">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">售價</label>
                                <input type="number" class="form-control" id="price"
                                placeholder="請輸入售價" v-model="templatePro.price">
                            </div>
                            </div>
                            <hr>

                            <div class="form-group">
                            <label for="description">產品描述</label>
                            <textarea type="text" class="form-control" id="description"
                                placeholder="請輸入產品描述" v-model="templatePro.description"></textarea>
                            </div>
                            <div class="form-group">
                            <label for="content">說明內容</label>
                            <textarea type="text" class="form-control" id="content"
                                placeholder="請輸入產品說明內容"  v-model="templatePro.content"></textarea>
                            </div>
                            <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox"
                                id="is_enabled" v-model="templatePro.is_enabled"
                                :true-value="1"
                                :false-value="0">
                                <label class="form-check-label" for="is_enabled">
                                是否啟用
                                </label>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
                    </div>
                    </div>
                </div>
                </div>
        </div>
<!-- 刪除 modal -->
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除產品</span>
                        </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ templatePro.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteProduct"
                        >確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '../Pagination'

export default {
    data(){
        return {
            products: [],
            templatePro: {},
            isNew: false,
            isLoading: false,
            status: {
                uploadImg: false
            },
            pagination: {}
        }
    },
    components: {
        Pagination
    },
    created(){
        this.getProducts();
        
    },
    methods: {
        getProducts(page = 1){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/admin/products?page=${page}`;
            const vm = this;
            vm.isLoading = true;
            console.log(api);
            this.$http.get(api).then((response) => {
            console.log(response.data)
                vm.products = response.data.products;
                vm.pagination = response.data.pagination;
                vm.isLoading = false;
            })
        },
        openModal(isNew, item){
            if(isNew){
                this.templatePro = {};
                this.isNew = true;
            } else {
                this.templatePro = Object.assign({}, item);
                this.isNew = false;
            }
            $('#productModal').modal('show');
        },
        openDelProModal(item){
            this.templatePro = item;
            console.log(this.templatePro);
            $('#delProductModal').modal('show');
        },
        updateProduct(){
            let api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/admin/product/${vm.templatePro.id}`;
                httpMethod = 'put';
            } 
            this.$http[httpMethod](api, {data: vm.templatePro}).then((response) => {
                if(response.data.success){
                    $('#productModal').modal('hide');
                    vm.getProducts();
                } else {
                    $('#productModal').modal('hide');
                    vm.getProducts();
                    console.log('新增失敗')
                }
            })
        },
        deleteProduct(){
            const vm = this;
            let api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/admin/product/${vm.templatePro.id}`;
             this.$http.delete(api).then((response) => {
                if(response.data.success){
                    $('#delProductModal').modal('hide');
                    vm.getProducts();
                } else {
                    $('#delProductModal').modal('hide');
                    vm.getProducts();
                    console.log('新增失敗')
                }
            })
        },
        uploadImg(){
            console.log(this);
            const uploadImg = this.$refs.files.files[0];
            const vm = this;
            const formData = new FormData();
            formData.append('file-to-upload', uploadImg);
            vm.status.uploadImg = true;
            let api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/admin/upload`;
             this.$http.post(api, formData, {
                headers: { 'content-type': 'multipart/form-data'}
             }).then((response) => {
                 console.log(response.data);
                if(response.data.success){
                    vm.$set(vm.templatePro, 'imageUrl', response.data.imageUrl);
                    vm.status.uploadImg = false;
                } else {
                    vm.$bus.$emit('message:push',  response.data.message, 'danger');
                }
            })
        },
    }

   
}
</script>