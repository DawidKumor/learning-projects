import chalk from 'chalk';
function colorCount(k) {
    for (let i = 1; i <= k; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log(chalk.hex('#7f3098')(i))
        } else if (i % 3 === 0) {
            console.log(chalk.red(i));
        } else if (i % 5 === 0) {
            console.log(chalk.blue(i));
        } else {
            console.log(chalk.white(i));
        }
    }
}
colorCount(100);