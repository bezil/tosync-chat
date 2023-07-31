<template>

  <q-page class="flex column justify-end" id="chatscroll">
     <div class="fixpos full-width" fixed-top>
        <q-banner dense class="semiop" >
      <template >
                <div  class="text-grey-5">
                  <q-icon name="star" class="q-pr-sm" color="secondary"></q-icon>
                  Skill: <b>{{otherUserDetail.skill}}</b>
                </div>
                <div  class="text-grey-5">
                  <q-icon name="policy" class="q-pr-sm" color="accent"></q-icon>
                  Need: <b>{{otherUserDetail.interest}}</b>
                </div>
      </template>

    </q-banner>
     </div>


      <template>
        <div class="q-pa-md row justify-center chat-container">
          <div style="width: 100%; ">
            <q-chat-message v-for="(message, key) in messages" :key="key"
              :name="message.from== 'me' ? userDetails.name : otherUserDetail.name"
              :text="[message.text]"
              :sent="message.from == 'me' ? true : false"
              :bg-color="message.from == 'me' ? 'grey-9' : 'blue-9'"
              text-color="white"
            />

          </div>
        </div>
      </template>
      <q-footer  class="to-footerbg">
        <q-toolbar class="full-width">

            <q-form class="full-width" >
                  <q-input placeholder="Type Message Here"
                  dark borderless
                  v-model="newMessage" >
                      <template v-slot:append>
                        <q-btn flat dense v-on:click.prevent="send" type="submit">
                          <q-icon name="send"/>
                        </q-btn>
                      </template>
                   </q-input>
            </q-form>


        </q-toolbar>
      </q-footer>
  </q-page>
</template>

<script>
import { scroll } from 'quasar';
const { getScrollHeight } = scroll;
const { getScrollTarget, setScrollPosition } = scroll;

import { mapState, mapActions } from 'vuex';
import mixinOUD from 'src/mixins/mixin-otheruserdetails'

export default {
  data() {
           el:'#chatscroll';
          return {
          name: 'chats',
          newMessage: '',
          drawer:false
          }
      },
      mixins:[mixinOUD],
      computed:{
        ...mapState('store',['messages','userDetails']),
      },
      methods:{
        ...mapActions('store',['firebaseGetMessages','firebaseStopGettingMessages','storeUID','firebaseSendMessage']),
        send: function(e){
          this.firebaseSendMessage({
            message: {
                text:this.newMessage,
                from:'me'
            },
            otherUserId:this.$route.params.otherUserId
          }),
          this.newMessage=''
        //  this.scrollToEnd()

        },
        scrollToEnd: function()  {
            var ele = this.$el.querySelector(".chat-container");
            const target = getScrollTarget(ele);
            const offset = ele.scrollHeight;
            const duration = 500;
            setScrollPosition(target, offset, duration);
        },

    },
    watch: {
	  	messages: function(val) {
	  		if (Object.keys(val).length) {

	  			setTimeout(() => {
	  			this.scrollToEnd()
	  			}, 200)
	  		}
	  	}
	  },

    mounted(){
      this.$q.notify({
        message: 'Loading.. Please Wait',
                    color: 'grey-9',
                    textColor:'grey-2',
                    timeout: '50'
      });
      this.firebaseGetMessages(this.$route.params.otherUserId);
      this.storeUID(this.$route.params.otherUserId);
    },
    destroyed(){
      this.firebaseStopGettingMessages();
    }


}
</script>

<style scoped>
#chat-scroll{
  max-height: 200px;
}
.fixpos{
  top:115px;
  position: fixed;
  z-index:2;
}
.semiop{
  background-color: rgba(39,40,41,0.95);
}
</style>
