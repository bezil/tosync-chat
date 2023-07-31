<template>
  <q-page class="flex">
        <div class="q-pa-md q-my-sm full-width" >
            <q-card style="max-width: 600px" class="bg-brand1">
              <q-tabs
                v-model="tab"
                align="justify"
                indicator-color="transparent"
                class="q-mb-sm"
                active-color="white"
                active-bg-color="brand"
              >
                <q-tab class="text-white" name="Login"
                label="Login" no-caps/>
                <q-tab class="text-white " name="Signup"
                label="Sign up" no-caps />
              </q-tabs>

              <div class="q-gutter-y-lg">
                <q-tab-panels
                  v-model="tab"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  class="text-white text-center bg-brand"
                >
                  <q-tab-panel name="Login" >
                    <auth-form :tab = "tab"/>
                  </q-tab-panel>

                  <q-tab-panel name="Signup" >
                    <auth-form :tab = "tab"/>
                  </q-tab-panel>
                </q-tab-panels>



              </div>
            </q-card>
          </div>
      <q-footer  class="to-footerbg">
        <q-toolbar class="full-width">

            <q-btn color="red-6" no-caps elevated v-on:click="googleLogin"
            @click="load" :loading="lbtn"
            class="full-width" label="Login with Google" />
        </q-toolbar>
      </q-footer>
  </q-page>
</template>

<script>

import { mapActions } from 'vuex';

import AuthForm from '../components/AuthForm.vue';
export default {
  data () {
    return {
      tab: 'Login',
      lbtn: false
    }
  },
  components: {
      AuthForm,
  },
  methods: {
     ...mapActions('store',['googleLogin']),
     load(){
               // we set loading state
              this.lbtn = true
              // simulate a delay
              setTimeout(() => {
                // we're done, we reset loading state
                this.lbtn = false
              }, 6000)
     },
     wait(){
              this.lbtn = true
              setTimeout(() => {
                this.lbtn = false
              }, 6000)
     }
  },
  mounted(){
    this.wait();
  }

}
</script>

<style scoped>
.text-brand {
  color: #35373B;
}
.bg-brand {
  background: #35373B;
}
.bg-brand1 {
  background-color: #2C2D34;
}
</style>
