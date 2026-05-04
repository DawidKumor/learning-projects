const projectStatus = {
  PENDING: {
      description: "Pending Execution"
  },
  SUCCESS: {
      description: "Executed Successfully"
  },
  FAILURE: {
      description: "Execution Failed"
  }
}

class ProjectIdea {
  status = projectStatus.PENDING;
  constructor(title, description) {
this.title = title;
this.description = description;
}
updateProjectStatus(newStatus) {
this.status = newStatus;
}
}
class ProjectIdeaBoard {
  ideas = []
constructor(title) {
  this.title = title;
}
pin(ProjectIdea){
  this.ideas.push(ProjectIdea)
}
unpin(ProjectIdea) {
 this.ideas = this.ideas.filter(idea => idea !== ProjectIdea)
}
count() {
  return this.ideas.length
}
formatToString() {
let str = `${this.title} has ${this.count()} idea(s)\n`;
const strIdeas = this.ideas.map(idea => {
  return `${idea.title} (${idea["status"]['description']}) - ${idea.description}`
}).join("\n");
return str + (strIdeas ? strIdeas + "\n" : "");
}
}
const board = new ProjectIdeaBoard("My Board");
const idea1 = new ProjectIdea("Idea A", "First idea");
const idea2 = new ProjectIdea("Idea B", "Second idea");

board.pin(idea1);
board.pin(idea2);

console.log(board.formatToString());