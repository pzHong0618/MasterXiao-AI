
const frontendUrl =  process.env.FRONTEND_URL || 'http://localhost:5173',
    port = process.env.PORT || 3000,
    ds_key = "sk-97c26fa1df004eb8894e34eec7986997";
let config = {
    dev: {
        port,
        frontendUrl,
        ds_key,
    },
    production: {
        port,
        frontendUrl,
        ds_key,
    }
}
export default config[process.env.NODE_ENV || 'dev'];