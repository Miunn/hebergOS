const Encore = require('@symfony/webpack-encore');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or subdirectory deploy
    //.setManifestKeyPrefix('build/')
    .copyFiles({from: './assets/images',
        // optional target path, relative to the output dir
        to: 'images/[path][name].[ext]',
        // if versioning is enabled, add the file hash too
        //to: 'images/[path][name].[hash:8].[ext]',
        // only copy files matching this pattern
        //pattern: /\.(png|jpg|jpeg)$/
    })

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. script.js)
     * and one CSS file (e.g. style.scss) if your JavaScript imports CSS.
     */
    .addEntry('default', './assets/js/script.js')
    .addEntry('admin', './assets/js/admin.js')
    .addEntry('mainPage', './assets/js/main-page.js')
    .addEntry('contactUs', './assets/js/contact-us.js')
    .addEntry('login', './assets/js/login.js')
    .addEntry('register', './assets/js/register.js')
    .addEntry('app', './assets/js/app.js')
    .addEntry('users', './assets/js/users.js')
    .addEntry('edit-user', './assets/js/edit-user.js')
    .addEntry('container', './assets/js/container.js')
    .addEntry('containerView', './assets/js/container/container-view.js')
    .addEntry('containerStats', './assets/js/container/container-stats.js')
    .addEntry('containerShell', './assets/js/container/container-shell.js')
    .addEntry('containerActions', './assets/js/container/container-actions.js')
    .addEntry('containerAdmin', './assets/js/container/container-admin.js')
    .addEntry('sortContainer', './assets/js/sort-containers.js')
    .addEntry('notifications', './assets/js/notifications.js')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // configure Babel
    // .configureBabel((config) => {
    //     config.plugins.push('@babel/a-babel-plugin');
    // })

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you use React
    //.enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
