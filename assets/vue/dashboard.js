var app = new Vue({
    el: '#dashboard',
    data() {
        return {
            user: [],
            guilds: [],
            session: [],
            cache: [],
        }
    },
    created() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => (this.user = data))

        fetch('/api/user')
            .then(response => response.json())
            .then(data => (this.guilds = data.user.guilds))

        fetch('/api/user/guild/cache')
            .then(res => res.json())
            .then(json => {
                this.cache = json
            });
    }
});