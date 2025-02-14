'use strict'

const core = require('@actions/core')
const github = require('@actions/github')

const main = async () => {
  const token = core.getInput('github-token')
  console.log('got a token?', !!token);
  const number = core.getInput('number')
  console.log('number', number);
  const repoString = core.getInput('repo')
  console.log('repoString', repoString);

  let repoObject
  if (repoString) {
    const [owner, repo] = repoString.split('/')
    repoObject = { owner, repo }
  } else {
    repoObject = github.context.repo
  }
  console.log('repoObject', JSON.stringify(repoObject));

  const octokit = github.getOctokit(token)
  console.log('got octokit?', !!octokit);

  console.log('about to call octokit.rest.pulls.createReview');
  try {
  await octokit.rest.pulls.createReview({
    ...repoObject,
    pull_number: number,
    event: 'APPROVE'
  })
  } catch (error) {
    console.error(error);
    throw error;
  }
  console.log('sucessfully called octokit.rest.pulls.createReview');
}

main().catch(err => core.setFailed(err.message))
