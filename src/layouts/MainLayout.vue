<template>
  <q-layout view="lHh lpr lFf" class="to-bg text-white">
    <q-header elevated class="to-headerbg">
        <q-toolbar>
          <q-btn v-if="$route.fullPath.includes('/chat')"
          flat round dense icon="arrow_back" class="q-mr-sm"
          v-go-back=" '/' "/>
          <q-btn v-if="$route.fullPath.endsWith('/')"
          flat round dense icon="menu" class="q-mr-sm"
           v-on:click="drawer = !drawer"/>
           <q-toolbar-title class="q-mx-sm text-weight-light text-subtitle1"
           v-if="$route.fullPath.endsWith('/auth')">
           Welcome to</q-toolbar-title>
          <q-space ></q-space>
          <!-- <q-btn flat round dense icon="search" class="q-mr-xs" /> -->
        </q-toolbar>
        <q-toolbar class="q-pb-md q-mx-sm">

          <div v-if="$route.fullPath.endsWith('/auth')" >
          <img src="../assets/tosynclogo.png" height="60"/>
          </div>
          <!-- avatar cofig -->

          <q-avatar v-if="userDetails.dp != null && $route.fullPath.endsWith('/')"  size="60px">
          <img :src="userDetails.dp" />
          </q-avatar>
          <q-avatar v-else-if="userDetails.dp == null && $route.fullPath.endsWith('/')" size="60px" color="grey-8" text-color="white">
              {{ firstletterUser }}
          </q-avatar>

          <q-avatar v-if="dpcheck != null && $route.fullPath.includes('/chat/')"  size="42px">
            <img :src="dpcheck" />
          </q-avatar>
          <q-avatar v-else-if="dpcheck == null && $route.fullPath.includes('/chat/')" size="42px" color="grey-8" text-color="white">
              {{firstletterOther}}
          </q-avatar>

          <q-toolbar-title class="">
            <div v-if="$route.fullPath.endsWith('/')" class="text-h6 text-weight-light">
            {{userDetails.name}}</div>
            <div v-if="$route.fullPath.includes('/chat/')" class="text-subtitle1 text-weight-light">
            {{title}}</div>

            <div v-if="$route.fullPath.endsWith('/')" class="text-body1">
            <div>
                  <q-badge color="primary">
                  <q-icon name="star" class="q-pr-sm"></q-icon>
                  {{userDetails.skill}}</q-badge>
            </div>
            <div>
                  <q-badge color="primary">
                  <q-icon name="policy" class="q-pr-sm"></q-icon>
                    {{userDetails.interest}}</q-badge>
            </div>



            </div>
            <div v-if="$route.fullPath.includes('/chat/')" class="text-small" >
                <q-badge :color="statuscheck == 'ONLINE' ? 'light-green-9' : 'grey-9'">
                     {{statuscheck}}
                 </q-badge>
            </div>


          </q-toolbar-title>
          <q-btn  v-if="$route.fullPath.endsWith('/')"  flat icon="edit"
          class="" @click="slideform"/>
          <q-dialog v-model="dialog" position="bottom">
              <q-card class="q-pa-md to-headerbg">
                <q-form>
                <div class="text-white text-subtitle2">What is your core Skill?</div>
                <q-input v-model="fieldSkill"  hint="Maximum 20 Characters" dark class="q-mb-md"
                :rules="[ val => val.length <= 20 || 'Please use maximum 20 characters']"/>
                <div class="text-white text-subtitle2">Which skill you are looking for?</div>
                <q-input v-model="fieldInterest"  hint="Maximum 20 Characters" dark class="q-mb-md"
                :rules="[ val => val.length <= 20 || 'Please use maximum 20 characters']"/>
                 <div class="text-center flex column">
                    <q-btn label="Save" type="submit" color="primary" class="q-mt-sm" v-on:click.prevent="editdata"/>
                    <q-btn label="Close" color="primary" flat class="q-mt-md" @click="closeform" />
                  </div>
                </q-form>
              </q-card>
            </q-dialog>
        </q-toolbar>
      </q-header>


      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="1000"

      >

        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; "
        class="to-headerbg" >
          <q-list padding>
            <q-item @click="logoutUser"
            clickable v-ripple >
              <q-item-section avatar>
                <q-icon name="exit_to_app" />
              </q-item-section>

              <q-item-section>
                Logout
              </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="../assets/drawerbg.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar  v-if="userDetails.dp != null" size="56px" class="q-mb-sm" rounded>
              <img :src="userDetails.dp">
            </q-avatar>
            <q-avatar  v-else-if="userDetails.dp == null" size="56px" class="q-mb-sm" color="primary" rounded text-color="white">
              {{ firstletterUser}}
            </q-avatar>
            <div class="text-weight-bold">{{userDetails.name}}</div>
            <div>{{userDetails.email}}</div>
          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {

  name: 'MainLayout',
   data () {
    return {
      drawer:false,
      dialog:false,
      fieldSkill:'',
      fieldInterest:''
    }
  },

  components: {

  },
  computed: {
      ...mapState('store',['userDetails','otherUserDetails']),

      title(){
        let currentPath = this.$route.fullPath;
        if(currentPath.includes('/chat/')){
          // return this.$store.state.store.users[this.$store.state.store.otherUserDetails.otherUserId];
          return this.$store.state.store.otherUserDetails.otherUserName;
        }
      },
      firstletterOther(){
        if(this.$store.state.store.otherUserDetails.otherUserId){
            if(this.$store.state.store.users[this.$store.state.store.otherUserDetails.otherUserId].name){
               return this.$store.state.store.users[this.$store.state.store.otherUserDetails.otherUserId].name.charAt(0)
            }
          }
      },
       firstletterUser(){
        if(this.userDetails.name){
             return  this.userDetails.name.charAt(0);
            }

      },
       statuscheck(){
          if(this.$store.state.store.otherUserDetails.otherUserId){
            if(this.$store.state.store.users[this.$store.state.store.otherUserDetails.otherUserId].status){
               return "ONLINE"
            }
            else{
               return "OFFLINE"
            }
          }
      },
       dpcheck(){
          if(this.$store.state.store.otherUserDetails.otherUserId){
            if(this.$store.state.store.users[this.$store.state.store.otherUserDetails.otherUserId].dp){
               return this.$store.state.store.users[this.$store.state.store.otherUserDetails.otherUserId].dp
            }
            else{
               return null
            }
          }
      },


  },
  methods: {
      ...mapActions('store',['logoutUser','updatemetaData','showmetaUpdate']),
         slideform(){
            this.dialog = true
         },
         closeform(){
           this.dialog = false
         },
         editdata(){
          this.updatemetaData({
                fieldSkill:this.fieldSkill,
                fieldInterest:this.fieldInterest,

          })
         this.dialog = false
          this.showmetaUpdate()
        // this.$store.state.store.userDetails.skill= this.fieldSkill,
        // this.$store.state.store.userDetails.interest= this.fieldInterest

        }
  },

  mounted(){


  }

}

</script>
<style scoped>
.text-small{
  font-size: 14px !important;
}
</style>
