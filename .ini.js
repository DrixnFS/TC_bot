//Inicialization of global drixnBot object
drixnBot = {};
//Adding paths object into drixnBot object
drixnBot.paths = {};
//Paths inicialization
drixnBot.paths['root'] = __dirname;
drixnBot.paths['backup'] = `${drixnBot.paths['root']}/backup`;
drixnBot.paths['private'] = `${drixnBot.paths.root}/private`;
drixnBot.paths['messages'] = `${drixnBot.paths.root}/modules/messages`;
drixnBot.paths['utils'] = `${drixnBot.paths.root}/modules/utils`;