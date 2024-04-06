import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js";

Vue.component("Loader", {
  template: `
    <div style="display: flex; justify-content: center; align-items: center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
});

new Vue({
  el: "#app",
  data() {
    return {
      loading: false,
      form: {
        name: "",
        value: "",
      },
      contacts: [],
    };
  },
  computed: {
    canCreate() {
      return this.form.name.trim() && this.form.name.trim();
    },
  },
  methods: {
    async createContact() {
      const { ...contact } = this.form;
      await request("/api/contacts", "POST", contact);
      this.contacts = [
        ...this.contacts,
        { ...contact, id: Date.now(), marked: false },
      ];
      this.form.name = this.form.value = "";
    },
    async markContact(id) {
      const contact = this.contacts.find(contact => contact.id === id);
      const updated = await request(`/api/contacts/${id}`, "PUT", {
        ...contact,
        marked: true,
      });
      contact.marked = updated.marked;
    },
    async deleteContact(id) {
      this.contacts = this.contacts.filter(contact => contact.id !== id);
      await request(`/api/contacts/${id}`, "DELETE");
    },
  },
  async mounted() {
    this.loading = true;
    const data = await request("/api/contacts");
    this.contacts = data;
    this.loading = false;
  },
});

async function request(url, method = "GET", data = null) {
  try {
    const headers = {};
    let body;
    if (data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }
    const request = await fetch(url, {
      method,
      headers,
      body,
    });
    return await request.json();
  } catch (err) {
    console.error(err.message);
  }
}
