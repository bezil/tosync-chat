<template>
    <q-form @submit="submitform" class="q-px-sm">
        <q-input v-if="tab == 'Signup'" dark v-model="formData.name" class="q-pb-sm" placeholder="Enter your Name"
         lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please Enter Name',
          val => val && val.length >= 1 || 'Name require atleast 1 characters'
        ]">
        <template v-slot:prepend>
          <q-icon name="account_circle" />
        </template>
      </q-input>
        <q-input dark v-model="formData.email"  class="q-pb-sm" type="email"
        placeholder="Enter your Email Address"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please Enter Email',
          val => this.reg.test(val) || 'Please Enter Correct Email'
        ]">
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
      </q-input>
        <q-input dark v-model="formData.password"  class="q-pb-sm" type="password"
        placeholder="Enter your Password"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please Enter Password',
          val => val && val.length > 5 || 'Password atleast 6 characters'
        ]">
        <template v-slot:prepend>
          <q-icon name="vpn_key" />
        </template>
      </q-input>

      <q-btn color="primary" no-caps elevated type="submit" :loading="loadingbtn"  @click="simulateProgress"
            class="full-width q-mt-md q-mb-sm" :label="tab" />
    </q-form>
</template>
<script>

import { mapActions } from 'vuex';

    export default {
        props: ['tab'],
        data(){
            return{
                    formData:{
                             name:'',
                             email:'',
                             password:''
                    },
                    loadingbtn:false,
                    reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

            }
        },
        methods:{
            ...mapActions('store',['registerUser','loginUser']),
            submitform(){
                if(this.tab == 'Login')
                {
                    this.loginUser(this.formData);

                }
                else
                {
                    this.registerUser(this.formData);
                }
            },simulateProgress() {
              // we set loading state
              this.loadingbtn = true
              // simulate a delay
              setTimeout(() => {
                // we're done, we reset loading state
                this.loadingbtn = false
              }, 2000)
            }
        }
    }
</script>
