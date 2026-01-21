const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'data.json');
const git = simpleGit();

const makeCommit = async (date) => {
    const data = { date: date.format() };
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add(FILE_PATH);
    await git.commit(date.format(), { '--date': date.format() });
};

const generateCommits = async () => {
    const startDate = moment('2025-01-01');
    const today = moment();

    try {
        await git.init();

        await git.addConfig('user.name', 'joeboy77');
        await git.addConfig('user.email', 'acheampongjoseph470@gmail.com');

        const branches = await git.branchLocal();
        if (!branches.all.includes('main')) {
            await git.checkoutLocalBranch('main');
        } else {
            await git.checkout('main');
        }

        while (startDate.isSameOrBefore(today)) {
            const commitCount = 10;  

            for (let i = 0; i < commitCount; i++) {
                await makeCommit(startDate);
            }
            startDate.add(1, 'day');
        }

        console.log('Pushing commits...');
        await git.push('origin', 'main', {'--force': null});
        console.log('All commits pushed successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

generateCommits();
