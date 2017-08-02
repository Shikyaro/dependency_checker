'use strict'

const requestPromise = require('request-promise-native')
const semver = require('semver')

class PackageChecker {
    checkPackages(packagesList) {
        const options = {
            json: true,
            headers: {
                'User-Agent': 'Alkor'
            }
        };
        
        return Promise.all(Object.keys(packagesList).map((key) => {
            options.uri = this.createPackageUrl(key)
            return requestPromise(options).then((data) => data)
            
        }))
        .then((data) => {
            const mappedVersions = this.mapVersions(data, packagesList);
            const comparedVersions = this.compareVersions(mappedVersions);
            return this.countOutdates(comparedVersions)
        });
    }
    
    createPackageUrl(pkgName) {
        return `http://registry.npmjs.org/${pkgName}`
    }
    
    mapVersions(results, packages) {
        let res = new Array();
        results.forEach((result) => {
            res.push({
                name: result.name,
                latest: result['dist-tags'].latest,
                current: packages[result.name]
            });
        });
        return res;
    }
    
    compareVersions(mappedData) {
        return mappedData.map((data) => {
            if (!semver.satisfies(data.latest, data.current)) {
                data.outdated = true;
                let fixedVersion = data.current
                
                if (data.current[0] === '~' || data.current[0] === '^') {
                    fixedVersion = data.current.slice(1)
                }
                data.diff = semver.diff(fixedVersion, data.latest)
            } else {
                data.outdated = false;
            }
            return data
        });
    }
    
    countOutdates(comparedData) {
        const res = {
            major: 0,
            minorOrPatch: 0,
            upToDate: 0
        };
        
        comparedData.forEach((data) => {
            if (data.outdated) {
                switch (data.diff) {
                    case 'major': 
                    res.major++ 
                    break
                    case 'minor':
                    case 'patch':
                    res.minorOrPatch++
                    break
                }
            } else {
                res.upToDate++
            }
        });
        return res;
    }
}

module.exports = PackageChecker;