module.exports = shipit => {
    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default: {
            deployTo: '/home/andrej/gameshows',
            repositoryUrl: 'git@github.com:adikus/gameshows.git',
            branch: 'main'
        },
        production: {
            servers: 'andrej@audio.adikus.me',
        },
    });

    shipit.config.copy = false;

    shipit.blTask('build', async () => {
        await shipit.remote(`bash -cl "cd ${shipit.releasePath}; docker compose -p gameshows build"`);
    });

    shipit.blTask('copy_config', async () => {
        await shipit.remote(`cd ${shipit.releasePath}; rm .env; ln -s ../../config/.env .env`);
    });

    shipit.blTask('restart_docker', async () => {
        await shipit.remote(`cd ${shipit.releasePath}; docker compose -p gameshows up -d`);
    });

    shipit.on('updated', async () => {
        await shipit.start('build');
        await shipit.start('copy_config');
    });

    shipit.on('published', async () => {
        await shipit.start('restart_docker');
    })
};
