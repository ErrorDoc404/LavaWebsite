var app = new Vue({
    el: '#dashboard',
    data() {
        return {
            user: [],
            bot: [],
            session: [],
        }
    },
    created() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => (this.user = data))

        fetch('/api/dashboard/bot')
            .then(response => response.json())
            .then(data => (this.bot = data))

        fetch('/api/dashboard/session')
    }
});