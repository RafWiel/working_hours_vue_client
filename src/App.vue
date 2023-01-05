<template>
  <v-app>
    <v-container
      fluid
      style="min-height: 100vh"
      class="pa-0">
      <v-row class="no-gutters d-flex flex-column flex-nowrap">
        <v-col>
          <!-- Main workspace -->
          <v-main >
            <app-bar
              @menuClicked="isNavigationBarOpen = !isNavigationBarOpen"
              @applyClicked="$root.$emit('settleTasks')"
              :isApplyEnabled="isTaskListSelection"/>
            <h5 class="px-2 py-1 yellow">Testy</h5>
            <h5 class="px-2 py-1 yellow">Suma</h5>
            <router-view
              :key="$route.path"
              @isProcessing="isProcessing = $event"
              @showMessage="showMessageDialog"
              @hideMessage="hideMessageDialog"
              @showQuestion="showQuestionDialog"
              @hideQuestion="hideQuestionDialog"/>
            <side-bar
              v-model="isNavigationBarOpen"
              :links="links"
              @isOpenChanged="setIsNavigationBarOpen"/>
            <loading-icon v-if="isProcessing" />
          </v-main>
        </v-col>
      </v-row>
      <!-- Message box -->
      <v-row justify="center" class="no-gutters">
        <message-dialog
          :title="messageDialog.title"
          :isVisible="messageDialog.isVisible"
          :message="messageDialog.message"
          :hideRequest="hideMessageDialog"/>
      </v-row>
      <!-- Delete message box -->
      <v-row justify="center" class="no-gutters">
        <question-dialog
          :title="questionDialog.title"
          :isVisible="questionDialog.isVisible"
          :itemId="questionDialog.id"
          :message="questionDialog.message"
          :hideRequest="hideQuestionDialog"
          @apply="runQuestionDialogCallback"/>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import LoadingIcon from '@/components/common/LoadingIcon.vue';
import AppBar from '@/components/common/AppBar.vue';
import SideBar from '@/components/common/SideBar.vue';
import MessageDialog from '@/components/message/MessageDialog.vue';
import QuestionDialog from '@/components/message/QuestionDialog.vue';

export default {
  name: 'App',
  components: {
    LoadingIcon,
    AppBar,
    SideBar,
    MessageDialog,
    QuestionDialog,
  },
  data: () => ({
    isProcessing: false,
    isTaskListSelection: false,
    isNavigationBarOpen: false,
    links: [
      { icon: 'mdi-account-multiple', text: 'Klienci', route: '/clients?settlement-type=2' },
      { icon: 'mdi-format-list-numbered', text: 'Zadania', route: '/tasks?settlement-type=2' },
      { icon: 'mdi-playlist-plus', text: 'Nowe zadanie Aldridge', route: '/ad/task_add' },
      { icon: 'mdi-playlist-plus', text: 'Nowe zadanie DataSoft', route: '/ds/task_add' },
    ],
    messageDialog: {
      title: null,
      message: null,
      isVisible: false,
    },
    questionDialog: {
      id: 0,
      title: '',
      message: '',
      isVisible: false,
      callbackFunction: {
        type: Function,
        default: () => {},
      },
    },
  }),
  mounted() {
    this.$root.$on('selectionChanged', (value) => {
      console.log('selection: ', value);
      this.isTaskListSelection = value;
    });
  },
  created() {
    // if (!localStorage.getItem('userInfo')) {
    //   if (this.$route.name !== 'Login' && this.$route.name !== 'Register') {
    //     this.$router.replace({ name: 'Login' });
    //   }
    //   return;
    // }

    // const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // // require login each day
    // const loginTimestamp = new Date(parseInt(userInfo.timestamp, 10));
    // if ((!loginTimestamp || loginTimestamp.getDate() !== new Date().getDate())
    // && this.$route.name !== 'Login'
    // && this.$route.name !== 'Register') {
    //   this.$router.replace({ name: 'Login' });
    //   return;
    // }

    // // set store user info
    // this.$store.dispatch('setUserName', userInfo.userName);
    // this.$store.dispatch('setToken', userInfo.token);
    // this.$store.dispatch('setAccountManager', userInfo.isAccountManager);
  },
  methods: {
    showMessageDialog(title, message) {
      this.messageDialog.title = title;
      this.messageDialog.message = message;
      this.messageDialog.isVisible = true;
    },
    hideMessageDialog() {
      this.messageDialog.isVisible = false;
    },
    showQuestionDialog(title, message, id, callbackFunction) {
      this.questionDialog.id = id;
      this.questionDialog.callbackFunction = callbackFunction;
      this.questionDialog.title = title;
      this.questionDialog.message = message;
      this.questionDialog.isVisible = true;
    },
    runQuestionDialogCallback(id) {
      this.questionDialog.callbackFunction(id);
    },
    hideQuestionDialog() {
      this.questionDialog.isVisible = false;
    },
    setIsNavigationBarOpen(value) {
      this.isNavigationBarOpen = value;
    },
  },
};
</script>

<style lang="scss">
  //@import url('https://fonts.googleapis.com/css?family=Montserrat:330,400,600,800');
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap');

  //$font-family: 'Montserrat';
  $font-family: 'Nunito';

  *, *::before, *::after {
    box-sizing: border-box;
  }

  // Vuetify buttons are uppercase by default, this allows normal text
  button {
    text-transform: unset !important;
  }

  #app {
    font-family: $font-family, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background: #f0f0f0;

    // @media (max-width: 960px) {
    //   background: white;
    // }
  }

  .v-application {
    [class*='text-'] {
      font-family: $font-family, sans-serif !important;
    }

    font-family: $font-family, sans-serif !important;
  }

  .v-btn {
    @media (max-width: 960px) {
      min-height: 50px;
    }
  }

  div.v-application--wrap {
    min-height:calc(100vh - 64px) !important;
  }

</style>
