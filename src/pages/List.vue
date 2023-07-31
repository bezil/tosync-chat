<template>
  <q-page class="flex">
      <q-list class="full-width" padding>
        <div v-for="(user, key) in users" :key="key">
           <q-item clickable :to="'/chat/' + key">
              <q-item-section top avatar class="justify-around">
                <q-avatar v-if="user.dp != ''" size="48px">
                  <img :src="user.dp">
                </q-avatar>
                <q-avatar v-else size="48px" color="grey-8" text-color="white">
  	            {{ user.name.charAt(0) }}
               </q-avatar>
              </q-item-section>

              <q-item-section>
                <div class="full-width flex justify-between">
                  <span class="text-body1">{{user.name}}</span>
                  <span>
                  <q-badge class="text-grey-4" dense
                  :color="user.status ? 'light-green-9' : 'grey-9'" >
                  {{user.status ? 'ONLINE' : 'OFFLINE'}}</q-badge>
                  </span>

                </div>
                <div caption class="text-grey-5">
                  <q-icon name="star" class="q-pr-sm" color="secondary"></q-icon>
                  {{user.skill}}
                </div>
                <div caption class="text-grey-5">
                  <q-icon name="policy" class="q-pr-sm" color="accent"></q-icon>
                  {{user.interest}}
                </div>
              </q-item-section>


            </q-item>

            <q-separator spaced inset="item" />
        </div>


    </q-list>
  </q-page>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('store',['users']),
  }
}
</script>


<style scoped>

</style>
