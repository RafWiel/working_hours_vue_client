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
              <!-- <h5 class="px-2 py-1 yellow">Widok portret: Klienci normalna lista. Szerokosc kolumn do poprawy na telefonie</h5>
              <h5 class="px-2 py-1 yellow">Wczytuj wersje po wpisaniu projektu</h5>
              <h5 class="px-2 py-1 yellow">TaskListView usun Ilosc godzin dla DataSoft</h5>
              <h5 class="px-2 py-1 yellow">Pamietaj filtry przy przeladowaniu</h5> -->
            <router-view
              :key="$route.path"
              @isProcessing="isProcessing = $event"
              @showMessage="showMessageDialog"
              @hideMessage="hideMessageDialog"
              @showAutoMessage="showAutoMessageDialog"
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
      <!-- Auto close message box -->
      <v-row justify="center" class="no-gutters">
        <auto-message-dialog
          :title="autoMessageDialog.title"
          :isVisible="autoMessageDialog.isVisible"
          :message="autoMessageDialog.message"/>
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
import userType from '@/enums/userType';
import LoadingIcon from '@/components/common/LoadingIcon.vue';
import AppBar from '@/components/common/AppBar.vue';
import SideBar from '@/components/common/SideBar.vue';
import MessageDialog from '@/components/message/MessageDialog.vue';
import AutoMessageDialog from '@/components/message/AutoMessageDialog.vue';
import QuestionDialog from '@/components/message/QuestionDialog.vue';
import taskType from '@/enums/taskType';

export default {
  name: 'App',
  components: {
    LoadingIcon,
    AppBar,
    SideBar,
    MessageDialog,
    AutoMessageDialog,
    QuestionDialog,
  },
  data: () => ({
    isProcessing: false,
    isTaskListSelection: false,
    isNavigationBarOpen: false,
    links: [],
    messageDialog: {
      title: null,
      message: null,
      isVisible: false,
    },
    autoMessageDialog: {
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
      this.isTaskListSelection = value;
    });

    this.$root.$on('refreshSidebar', () => {
      this.initializeSidebar();
    });

    this.initializeSidebar();

    console.log(this.$store.state.locale);
  },
  created() {
    console.log(localStorage.getItem('userInfo'));
    this.setLocale();
  },
  methods: {
    initializeSidebar() {
      this.links = [];

      if (this.$store.state.userType !== userType.aldridge) {
        this.links.push({
          icon: 'mdi-account-multiple',
          value: 'clients',
          route: '/clients',
        });
      }

      if (this.$store.state.userType !== userType.administrator) {
        this.links.push({
          icon: 'mdi-format-list-numbered',
          value: 'tasks',
          route: '/tasks',
        });
      }

      if (this.$store.state.userType === userType.administrator) {
        this.links.push({
          icon: 'mdi-format-list-numbered',
          value: 'tasks',
          route: `/tasks?task-type=${taskType.priceBased}`,
        });

        this.links.push({
          icon: 'mdi-playlist-plus',
          value: 'newTaskAd',
          route: '/tasks/ad',
        });

        this.links.push({
          icon: 'mdi-playlist-plus',
          value: 'newTaskDs',
          route: '/tasks/ds',
        });
      }
    },
    showMessageDialog(title, message) {
      this.messageDialog.title = title;
      this.messageDialog.message = message;
      this.messageDialog.isVisible = true;
    },
    hideMessageDialog() {
      this.messageDialog.isVisible = false;
    },
    showAutoMessageDialog(title, message) {
      this.autoMessageDialog.title = title;
      this.autoMessageDialog.message = message;
      this.autoMessageDialog.isVisible = true;

      setTimeout(() => { this.autoMessageDialog.isVisible = false; }, 1000);
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
    setLocale() {
      // set locale
      if (!this.$store.state.locale) return;

      this.$i18n.locale = this.$store.state.locale;
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
    @media (max-width: 600px) {
      min-height: 50px;
    }
  }

  div.v-application--wrap {
    min-height:calc(100vh - 64px) !important;
  }

</style>
