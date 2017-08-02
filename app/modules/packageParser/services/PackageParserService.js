'use strict'

const requestPromise = require('request-promise-native')

class PackageParserService {

    requestPackage(repoUrl) {
        const repoData = this.reformatUrl(repoUrl);
        const url = repoData.url;


        const options = {
            uri: url,
            json: true,
            headers: {
                'User-Agent': 'Alkor'
            }
        };

        return requestPromise(options)
            .then((data) => {
                options.uri = data.download_url
                return requestPromise(options).
                    then((data) => {
                        return {
                            deps: data.dependencies,
                            name: repoData.repo,
                            username: repoData.username,
                            err: null
                        }
                    })
                    .catch((err) => {
                        return {
                            deps: null,
                            err: err
                        }
                    });
            })
            .catch((err) => err);
    }

    reformatUrl(repoUrl) {
        const testUrl = 'https://github.com/bower/bower'
        const [proto, nil, domain, user, repo] = repoUrl.split('/')
        const url =  `https://api.github.com/repos/${user}/${repo}/` +
            `contents/package.json`
        return {
            url: url,
            username: user,
            repo: repo
        }
    }

}

module.exports = PackageParserService;