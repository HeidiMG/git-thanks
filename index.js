const axios = require("axios");

const argv = require("yargs")
    .alias("r", "repo")
    .alias("o", "owner")
    .demandOption("repo")
    .demandOption("owner").argv;

const thankeeMap = new Map();

function getThankee(user) {
    let thankee = thankeeMap.get(user.login);
    if (!thankee) {
        thankee = {
            user,
            stats: {
                issueComments: 0
            }
        };
        thankeeMap.set(user.login, thankee);
    }
    return thankee;
}

const promises = [];

promises.push(
    axios
        .get(
            `https://api.github.com/repos/${argv.owner}/${
                argv.repo
            }/issues/comments`
        )
        .then(response => {
            console.log(response.data.length);
            for (const comment of response.data) {
                let context =
                    comment.body.length > 20
                        ? comment.body.slice(0, 20)
                        : comment.body;
                console.log(
                    `${comment.user.login}: ${context}  ****** `,
                    comment.issue_url,
                    comment.created_at
                );
                let thankee = getThankee(comment.user);
                thankee.stats.issueComments++;
            }
        })
);

// Promise.all(promises).then(() => {
//     for (const thankee of thankeeMap.values()) {
//         console.log(thankee.user.login, thankee.stats);
//     }
// });
