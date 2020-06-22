<template>
    <div>
        <loading :active.sync="isLoading" ></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                     :style="{backgroundImage: `url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{ item.category}}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{item.title}}</a>
                    </h5>
                    <p class="card-text">{{item.content}}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
                        <del class="h6" v-if="item.price">{{item.origin_price}}</del>
                        <div class="h5" v-if="item.price">{{item.price}}</div>
                    </div>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin"  v-if="status.loadingItem == item.id"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addCarts(item.id)">
                        <i class="fas fa-spinner fa-spin"  v-if="status.loadingItem == item.id"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
         <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img :src="product.image" class="img-fluid" alt="">
                    <blockquote class="blockquote mt-3">
                    <p class="mb-0">{{ product.content }}</p>
                    <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                    </blockquote>
                    <div class="d-flex justify-content-between align-items-baseline">
                    <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                    <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                    <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
                    </div>
                    <select name="" class="form-control mt-3" v-model="product.num">
                    <option :value="num" v-for="num in 10" :key="num">
                        選購 {{num}} {{product.unit}}
                    </option>
                    </select>
                </div>
                <div class="modal-footer">
                    <div class="text-muted text-nowrap mr-3">
                    小計 <strong>{{ product.num * product.price }}</strong> 元
                    </div>
                    <button type="button" class="btn btn-primary"
                    @click="addCarts(product.id, product.num)">
                    <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                    加到購物車
                    </button>
                </div>
                </div>
            </div>
        </div>
        <table class="table">
            <thead>
                <th></th>
                <th>品名</th>
                <th>數量</th>
                <th>單價</th>
            </thead>
            <tbody>
                <tr v-for="item in cart.carts">
                <td class="align-middle">
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
                    <i class="far fa-trash-alt"></i>
                    </button>
                </td>
                <td class="align-middle">
                    {{ item.product.title }}
                    <!-- <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                    </div> -->
                </td>
                <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.final_total }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                <td colspan="3" class="text-right">總計</td>
                <td class="text-right">{{ cart.total }}</td>
                </tr>
                <tr>
                <td colspan="3" class="text-right text-success">折扣價</td>
                <td class="text-right text-success">{{ cart.final_total }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
                </button>
            </div>
        </div>

        <ValidationObserver
        v-slot="{ handleSubmit  }"
        >
        <div class="my-5 row justify-content-center">
            <form class="col-md-6"  @submit.prevent="handleSubmit(createOrder)">
                <div class="form-group">
                    <label for="useremail">Email</label>
                    <ValidationProvider name="Email"
                    rules="required|email" 
                    v-slot="{ failed, errors }"
                    >
                        <input type="email" class="form-control" :class="{ 'is-invalid': failed }" name="email" id="useremail"
                            v-model="form.user.email" placeholder="請輸入 Email" required>
                        <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            
                <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <ValidationProvider name="姓名"
                        rules="required" 
                        v-slot="{ failed, errors }"
                        >
                    <input type="text" class="form-control"  :class="{ 'is-invalid': failed }"  name="name" id="username"
                        v-model="form.user.name" placeholder="輸入姓名">
                    <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>

                </div>
            
                <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <ValidationProvider name="電話"
                    rules="required" 
                    v-slot="{ failed, errors }"
                    >
                        <input type="tel" class="form-control" id="usertel" :class="{'is-invalid': failed}" v-model="form.user.tel" placeholder="請輸入電話" required>
                        <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
            
                <div class="form-group">
                <label for="useraddress">收件人地址</label>
                    <ValidationProvider name="地址"
                        rules="required" 
                        v-slot="{ failed, errors }"
                        >
                        <input type="text" class="form-control" name="address" :class="{'is-invalid': failed}"  id="useraddress" v-model="form.user.address"
                            placeholder="請輸入地址">
                        <span class="text-danger" v-if="errors[0]">地址欄位不得留空</span>
                    </ValidationProvider>
                </div>
            
                <div class="form-group">
                <label for="comment">留言</label>
                <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                </div>
                <div class="text-right">
                <button class="btn btn-danger">送出訂單</button>
                </div>
            </form>
        </div>
            </ValidationObserver>
    </div>
</template>


<script>
// import $ from 'jquery';

export default {
    data(){
        return {
            products: [],
            isLoading: false,
            product: {},
            status: {
                loadingItem: ''
            },
            form: {
                "user": {
                    "name": "",
                    "email": "",
                    "tel": "",
                    "address": ""
                },
                "message": "" 
            },
            cart: [],
            coupon_code: ''
        }
    },
    methods: {
        getProducts(){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/products`;
            const vm = this;
            vm.isLoading = true;
            console.log(api);
            this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.products = response.data.products;
                vm.isLoading = false;
            })
        },
        getProduct(id){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/product/${id}`;
            const vm = this;
            vm.isLoading = true;
            console.log(api);
            vm.status.loadingItem = id;
            this.$http.get(api).then((response) => {
                $('#productModal').modal('show');
                console.log(response.data)
                vm.product = response.data.product;
                vm.product.num = vm.product.num? vm.product.num: 1; 
                vm.isLoading = false;
                vm.status.loadingItem = '';
            })
        },
        getCarts(){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/cart`;
            const vm = this;
            vm.isLoading = true;
            console.log(api);
            this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.cart = response.data.data;
                vm.isLoading = false;
            })
        },
        addCarts(id, qty = 1){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/cart`;
            const vm = this;
            vm.status.loadingItem = id;
            let cart = {
                product_id: id,
                qty
            }
            this.$http.post(api, {data: cart}).then((response) => {
                vm.status.loadingItem = '';
                $('#productModal').modal('hide');
                this.getCarts();
            })
        },
        removeCartItem(id){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
            const vm = this;
            vm.isLoading = true;
            this.$http.delete(api).then(() => {
                vm.isLoading = false;
                this.getCarts();
            })
        },
        addCouponCode(){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/coupon`;
            const vm = this;
            vm.isLoading = true;
            let coupon = {
                code: vm.coupon_code
            }
            this.$http.post(api, {data: coupon}).then((response) => {
                console.log('addCouponCode', response);
                vm.isLoading = false;
                this.getCarts();
            })
        },
        createOrder(){
            const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/order`;
            const vm = this;
            // vm.isLoading = true;
            this.$http.post(api, {data: this.form}).then((response) => {
                console.log(response);
                if(response.data.success){
                    vm.$router.push(`/customer_checkout/${response.data.orderId}`)
                }
                vm.isLoading = false;
            }) 
        }
    },
    created(){
        this.getProducts();
        this.getCarts();
    },
}
</script>