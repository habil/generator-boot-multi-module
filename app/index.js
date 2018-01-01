'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');

var BootMultiModuleGenerator = module.exports = function BootMultiModuleGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
};

util.inherits(BootMultiModuleGenerator, yeoman.generators.Base);

BootMultiModuleGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    console.log(chalk.green(
		'MMMMMMMMMNmdhhhhddNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n' +
		'MMMMMMdyo++++++++++oydMMyMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMyshMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n' +
		'MMMMho++++++++++++++++o:`hMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMhydMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n' +
		'MMNs++++++++++++++++/-`  :NMMMMMMMMMmdddmNMMNdmMMmdddmMMMMNdmMNmdNMmdNMNdmMNmddmNMMMMMNmdddNMNddMMMM\n' +
		'MNo++++++++////::-.`     `hMMMMMMMdo+oss++oNy++yo+oo+++yNMy++o+++sN++sMo++s+o++++yMMms+++oo+ss++dMMM\n' +
		'My+++++:.`                +MMMMMMMo+omMMMmNMy++odMMMNh++oNy+++ymMMN++oMo++yNMMmo++mmo+odMMMNh+++dMMM\n' +
		'Ms+++/`              `.   /MMMMMMMms++osydNMy++dMMMMMMy++dy++yMMMMN++oMo++NMMMMh++dy++dMMMMMMy++dMMM\n' +
		'Ms+++`             `-.    oMMMMMMMMMNmdyo+omy++yMMMMMMs++my++dMMMMN++oMo++NMMMMh++dh++yMMMMMMs++dMMM\n' +
		'Md+++           `-:-     .dMMMMMMmsyhmmmy++dy+++sdmmho++yMy++dMMMMN++oMo++NMMMMh++dMs++sdmmho+++dMMM\n' +
		'MMy++:    ``.-:/:.      -yMMMMMMMNdysoooosdMy++hhso+ooymMMdoomMMMMMooyMyosMMMMMdoomMMmyoooosho++NMMM\n' +
		'MMMdo/-:/+/:-.`     `.:+hMMMMMMMMMMMMMMMMMMMy++dMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMoosyhhhyo+odMMMM\n' +
		'MMMMNo-/+++++++++++++ohNMMMMMMMMMMMMMMMMMMMMmssNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNdhysssyhdNMMMMM\n' +
		'MMMMMMMmhyo++++++oshmMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n' +
		'MMMMMMMMMMMMMNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMhmhmhmNMmmmmmdNmmmdmMMM\n' +
		'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMmmdmMhmmMhMhdmyNhddNhNhdmNNM\n' +
		'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNNmMNMMMNMNNMNNNMNNNNNNMNNM\n' +
         chalk.yellow('\nWelcome to the Multi Module Spring Boot Generator\n\nLets get started!\n\n')));


    var prompts = [
        {
            type: 'string',
            name: 'bootVersion',
            message: 'Enter Spring Boot version:',
            default: '1.5.9.RELEASE'
        }, {
            type: 'string',
            name: 'packageName',
            message: 'Enter default package name:',
            default: 'com.spring.generator'
        }, {
            type: 'string',
            name: 'baseName',
            message: 'Enter base name of app:',
            default: 'multi-module-project'
        }, {
            type: 'string',
            name: 'javaVersion',
            message: 'Enter Java version:',
            default: '1.8'
        }, {
            type: 'checkbox',
            name: 'buildTool',
            message: 'Select build tool: (Gradle not implemented yet :)',
            choices: [
                {
                    name: 'Maven',
                    value: 'maven',
                    checked: true
                }, {
                    name: 'Gradle',
                    value: 'gradle'
                }
            ]
        }
    ];

    this.prompt(prompts, function(props) {
        this.bootVersion = props.bootVersion;
        this.packageName = props.packageName;
        this.baseName = props.baseName;
        this.javaVersion = props.javaVersion;
        this.buildTool = props.buildTool;
        this.packagingType = props.packagingType;
        this.parentGroupId = props.parentGroupId;
        this.currentPath = props.currentPath;
        this.currentPackage = props.currentPackage;
        cb();
    }.bind(this));
};

BootMultiModuleGenerator.prototype.app = function app() {
    var packageFolder = this.packageName.replace(/\./g, '/');
    var srcDir = 'src/main/java/' + packageFolder;
	var tstDir = 'src/test/java' + packageFolder;
    var resourceDir = 'src/main/resources';
    var baseName = this.baseName;
    var javaVersion = this.javaVersion;
	var bootVersion = this.bootVersion;
	
	var moduleNames = ['bundle-app','bundle-cloud', 'bundle-web', 'common-lib', 'core-api', 'core-domain', 'core-model', 'core-parent', 'core-service', 'core-test', 'parent'];
	for(var i = 0; i < moduleNames.length; i++){
		var currentPath = this.baseName + '-' + moduleNames[i];
        this.currentPath = currentPath;
        this.parentGroupId = this.packageName+'.'+this.baseName.replace(/-/gi,'.');
		if('bundle-app' === moduleNames[i]){
            mkdirp(currentPath);//module folder creation
            this.packagingType = 'ear';
			this.template('build.xml', currentPath + '/build.xml');
            this.template('pom-bundle-app.xml', currentPath + '/pom.xml');
		} else if('bundle-cloud' === moduleNames[i]) {
            this.template('pom-bundle-cloud.xml', currentPath + '/pom.xml');
            mkdirp(currentPath + '/src/test/java');
            mkdirp(currentPath + '/src/main/resources');
            this.template('application.properties', currentPath + '/src/main/resources/application.properties');
            this.template('logback.xml', currentPath + '/src/main/resources/logback.xml')
            var tmp = currentPath + '/' + srcDir + '/' + this.baseName.replace(/-/gi,'/') + '/conf';
            mkdirp(tmp);
            this.template('DomainConfig.java', tmp + '/DomainConfig.java');
            this.template('ServiceConfig.java', tmp + '/ServiceConfig.java');
		} else if ('bundle-web' === moduleNames[i]) {
            this.template('pom-bundle-web.xml', currentPath + '/pom.xml');
            mkdirp(currentPath + '/src/test/java');
            mkdirp(currentPath + '/src/main/resources');
            mkdirp(currentPath + '/src/main/webapp/WEB-INF');
            this.template('weblogic.xml', currentPath + '/src/main/webapp/WEB-INF/weblogic.xml');
            this.template('application.properties', currentPath + '/src/main/resources/application.properties');
            this.template('logback.xml', currentPath + '/src/main/resources/logback.xml')
            var tmp = currentPath + '/' + srcDir + '/' + this.baseName.replace(/-/gi,'/') + '/conf';
            mkdirp(tmp);
            this.template('DomainConfig.java', tmp + '/DomainConfig.java');
            this.template('ServiceConfig.java', tmp + '/ServiceConfig.java');
        } else if('common-lib' === moduleNames[i]){
            this.template('pom-common-lib.xml', currentPath + '/pom.xml');
            mkdirp(currentPath + '/src/test/java');
            var tmp = currentPath + '/' + srcDir + '/' + this.baseName.replace(/-/gi,'/');
            mkdirp(tmp);
            this.currentPackage =  this.packageName + '.' + this.baseName.replace(/-/gi,'.');
            this.template('package-info.java', tmp + '/package-info.java');
        } else if('core-api' === moduleNames[i]){
            this.template('pom-core-api.xml', currentPath + '/pom.xml');
            mkdirp(currentPath + '/src/test/java');
            var tmp = currentPath + '/' + srcDir + '/' + this.baseName.replace(/-/gi,'/') + '/core/service/api';
            mkdirp(tmp);
            this.currentPackage =  this.packageName + '.' + this.baseName.replace(/-/gi,'.') + '.core.service.api';
            this.template('package-info.java', tmp + '/package-info.java');
            mkdirp(tmp+'/schema');
            this.currentPackage = this.packageName + '.' + this.baseName.replace(/-/gi,'.') + '.core.service.api.schema';
            this.template('package-info.java', tmp + '/schema/package-info.java');
        } else if('core-domain' === moduleNames[i]){
            this.template('pom-core-domain.xml', currentPath + '/pom.xml');
            mkdirp(currentPath + '/src/test/java');
            var tmp = currentPath + '/' + srcDir + '/' + this.baseName.replace(/-/gi,'/') + '/core/domain';
            mkdirp(tmp);
            this.currentPackage = this.packageName + '.' + this.baseName.replace(/-/gi,'.') + '.core.domain';
            this.template('package-info.java', tmp + '/package-info.java');
        } else if('core-model' === moduleNames[i]){
            this.template('pom-core-model.xml', currentPath + '/pom.xml');
            mkdirp(currentPath + '/src/test/java');
            var tmp = currentPath + '/' + srcDir + '/' + this.baseName.replace(/-/gi,'/') + '/core/domain/model';
            mkdirp(tmp);
            this.currentPackage = this.packageName + '.' + this.baseName.replace(/-/gi,'.') + '.core.domain.model';
            this.template('package-info.java', tmp + '/package-info.java');
        } else if('core-parent' === moduleNames[i]){
            this.packagingType = 'pom';
            this.template('pom-core-parent.xml', currentPath + '/pom.xml');
        } else if('core-service' === moduleNames[i]){
            this.template('pom-core-service.xml', currentPath + '/pom.xml');
            mkdirp(currentPath + '/src/test/java');
            var tmp = currentPath + '/' + srcDir + '/' + this.baseName.replace(/-/gi,'/') + '/core/service';
            mkdirp(tmp);
            this.currentPackage = this.packageName + '.' + this.baseName.replace(/-/gi,'.') + '.core.service';
            this.template('package-info.java', tmp + '/package-info.java');
        } else if('core-test' === moduleNames[i]){
            this.template('pom-core-test.xml', currentPath + '/pom.xml');
        } else if('parent' === moduleNames[i]){
            this.packagingType = 'pom';
            this.template('pom-parent.xml', currentPath + '/pom.xml');
        }
    }
    
    //this.template('.gitignore', + '.gitignore');

    // if ('gradle' === this.buildTool[0]) {
    //     this.template('build.gradle', 'build.gradle');
    // }
    // if ('maven' === this.buildTool[0]) {
    //     this.template('pom.xml', 'pom.xml');
    // }

    this.config.set('packageName', this.packageName);
    this.config.set('packageFolder', packageFolder);
};

BootMultiModuleGenerator.prototype.projectfiles = function projectfiles() {};
