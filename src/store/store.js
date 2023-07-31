import Vue from 'vue'
import {  Notify } from 'quasar'
import {firebaseAuth, firebaseDb, goAuth} from '../boot/firebase'

let messagesRef

const state = {
    userDetails: {},
    users: {},
    messages: {},
    otherUserDetails: {}
}
const mutations = {
	setUserDetails(state, payload) {
		state.userDetails = payload
    },
    addUser(state, payload) {
		Vue.set(state.users, payload.userId, payload.userDetails)
    },
	updateUser(state, payload) {
		Object.assign(state.users[payload.userId], payload.userDetails)
    },
    addMetaData(state, payload) {
        console.log("workin g")
        state.userDetails.skill = payload.userDetails.skill
        state.userDetails.interest = payload.userDetails.interest
        //state.userDetails = payload
    },
    addMessage(state, payload) {
		Vue.set(state.messages, payload.messageId, payload.messageDetails)
    },
	clearMessages(state) {
        state.messages = {}
    },
    clearfix(){
        state.otherUserDetails.otherUserId = ""
    },
	storeotheruid(state, payload) {
        let otherUserName = ""
        let otherUserStatus = ""
            Object.keys(state.users).forEach(key => {

                if (key == payload.otherUserId) {
                    otherUserName = state.users[key].name
                    otherUserStatus = state.users[key].status
                 }
            })
        Vue.set(state.otherUserDetails, 'otherUserId', payload.otherUserId)
        Vue.set(state.otherUserDetails, 'otherUserName', otherUserName)
        Vue.set(state.otherUserDetails, 'otherUserStatus', otherUserStatus)

    }

}

const actions = {
    registerUser({}, payload){
        firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
            console.log(response);
            let userId = firebaseAuth.currentUser.uid
				firebaseDb.ref('users/' + userId).set({
					name: payload.name,
					email: payload.email,
                    status: true,
                    dp: "",
                    skill: "skill not added",
                    interest:"interest not added"
				})

        })
        .catch(error => {
            console.log(error.message);
        })
        },
        loginUser({}, payload) {
            firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
                .then(response => {
                    console.log(response)

                })
                .catch(error => {
                    console.log(error.message)

                    Notify.create({
                        message: 'Wrong Credentials',
                        color: 'grey-9',
                        textColor:'grey-2',
                        timeout: '2000'
                      })
                })
        },
        googleLogin(){
            firebaseAuth.signInWithRedirect(goAuth).then(function() {
                return firebaseAuth.getRedirectResult();
              }).then(function(result) {
                // This gives you a Google Access Token.
                // You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.


                var user = result.user;
                let userId = firebaseAuth.currentUser.uid
                firebaseDb.ref('users/' + userId).set({
                name: user.displayName,
                email: user.email,
                dp: user.photoURL,
                skill:"skill not added",
                interest:"interest not added"
              })
                // ...
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

              });

        },
        logoutUser({ commit, dispatch }){
            dispatch('firebaseUpdateUser', {
                userId: state.userDetails.userId,
                updates: {
                    status: false
                }
              });
              commit('setUserDetails', {});
            firebaseAuth.signOut();
        },

        handleAuthStateChanged({ commit, dispatch, state }) {



            firebaseAuth.onAuthStateChanged(user => {
              if (user) {

                // User is logged in.
                let userId = firebaseAuth.currentUser.uid
                firebaseDb.ref('users/' + userId).once('value', snapshot => {
                    let userDetails = snapshot.val()
                    commit('setUserDetails', {
                        name: userDetails.name,
                        email: userDetails.email,
                        userId: userId,
                        dp:user.photoURL,
                        skill:userDetails.skill,
                        interest:userDetails.interest
                    })
                });
                dispatch('firebaseUpdateUser', {
                    userId: userId,
                    updates: {
                        status: true
                    }
                });

                dispatch('firebaseGetUsers');
                this.$router.push('/');

                Notify.create({
                    message: 'Loading.. Please Wait',
                    color: 'grey-9',
                    textColor:'grey-2',
                    timeout: '400'
                  })


              }
              else {
                  // User is logged out.

                  this.$router.replace('/auth');

              }
            })
        },
        firebaseUpdateUser({}, payload) {
            if (payload.userId) {
                firebaseDb.ref('users/' + payload.userId).update(payload.updates)
            }
        },
        firebaseGetUsers({ commit }) {
            firebaseDb.ref('users').on('child_added', snapshot => {
                let userDetails = snapshot.val()
                let userId = snapshot.key
                commit('addUser', {
                    userId,
                    userDetails
                })
            })
            firebaseDb.ref('users').on('child_changed', snapshot => {
                let userDetails = snapshot.val()
                let userId = snapshot.key
                commit('updateUser', {
                    userId,
                    userDetails
                })
            })
        },
        firebaseGetMessages({ commit, state }, otherUserId) {

            let userId = state.userDetails.userId
            messagesRef = firebaseDb.ref('chats/' + userId + '/' + otherUserId)
            messagesRef.on('child_added', snapshot => {
                let messageDetails = snapshot.val()
                let messageId = snapshot.key
                commit('addMessage', {
                    messageId,
                    messageDetails
                })
            })

        },
        firebaseStopGettingMessages({ commit }) {
            if (messagesRef) {
                messagesRef.off('child_added')
                commit('clearMessages')
            }
            commit('clearfix')
        },
        storeUID({ commit }, otherUserId) {
            commit('storeotheruid', {otherUserId})

        },
        firebaseSendMessage({}, payload) {
            firebaseDb.ref('chats/' + state.userDetails.userId + '/' + payload.otherUserId).push(payload.message)

            payload.message.from = 'them'
            firebaseDb.ref('chats/' + payload.otherUserId + '/' + state.userDetails.userId).push(payload.message)
        },
        updatemetaData({}, payload){
            firebaseDb.ref('users/' + state.userDetails.userId + '/skill').set(payload.fieldSkill)
            firebaseDb.ref('users/' + state.userDetails.userId + '/interest').set(payload.fieldInterest)

        },
        showmetaUpdate({ commit }) {

            firebaseDb.ref('users').on('child_added', snapshot => {
                let userDetails = snapshot.val()
                let userId = snapshot.key
                if(userId === state.userDetails.userId){
                    console.log(snapshot.val())

                    commit('addMetaData', {
                        userId,
                        userDetails
                    })
                }

            })

        },
}
const getters = {
    users: state => {
        let usersFiltered = {}
		Object.keys(state.users).forEach(key => {
			if (key !== state.userDetails.userId) {
				usersFiltered[key] = state.users[key]
            }

    	})
    return usersFiltered;
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}
