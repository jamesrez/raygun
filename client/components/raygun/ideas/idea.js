window.Idea = class {

  createClassCode(){
    let ideaClassName = this.name;
    ideaClassName = ideaClassName[0].toUpperCase() + ideaClassName.substr(1, ideaClassName.length);
    ideaClassName = ideaClassName.split('');
    for(var i=0; i < ideaClassName.length; i++) {
      if (ideaClassName[i] === " "){
        let nextLetter = ideaClassName[i+1].toUpperCase()
        ideaClassName.splice(i, 2, nextLetter);
        i -= 1;
      }
    }
    ideaClassName = ideaClassName.join('');
    let codeStart = `
    window.${ideaClassName} = class {

      constructor(thing){
        Object.assign(this, thing);
      }

      build(){
    `
    let codeEnd = `
      }
    }
    `
    return {
      className : ideaClassName,
      classCode : codeStart + "\t" + this.code + codeEnd
    }
  }

  constructor(idea, soul = null){
    if(idea){
      this.id = idea.id || UUID();
      this.soul = idea.soul || soul || null;
      this.name = idea.name || "Untitled Idea";
      this.desc = idea.desc || "This is an idea!";
      this.data = idea.data;
      this.dataCount = idea.dataCount || 0;
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = idea.creatorId || userId;
      this.creatorName = idea.creatorName || username;
      this.creatorPubKey = idea.creatorPubKey || dimBeingEdited.creatorPubKey;
      this.isPrivate = idea.isPrivate || false;
      this.code = idea.code || `//Write code for ${this.name}`;
      let classData = this.createClassCode()
      this.classCode = idea.classCode || classData.classCode;
      this.className = idea.className || classData.className;
      this.exists = idea.exists || true;
      this.ideas = idea.ideas || {null : null};
      this.ideaCount = idea.ideaCount || 0;
      this.parentIdea = idea.parentIdea || false;
      this.loadOrder = idea.loadOrder || 0;
    }else{
      this.id = UUID();
      this.soul = soul || null;
      this.name = "Untitled Idea";
      this.desc = "This is an idea!";
      this.data = {null : null};
      this.dataCount = 0;
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId;
      this.creatorName = username;
      this.creatorPubKey = dimBeingEdited.creatorPubKey;
      this.isPrivate = false;
      this.code = `//Write code for ${this.name}`;
      let classData = this.createClassCode()
      this.classCode = classData.classCode;
      this.className = classData.className;
      this.exists = true;
      this.ideas = {null : null};
      this.ideaCount = 0;
      this.parentIdea = false;
      this.loadOrder = 0;
    }
  }

  save(){
    loadedIdeas[this.id] = this;
    let thisRaygun = gun.user(this.creatorPubKey)
    thisRaygun.get('idea/' + this.id).put(this);
    if(!this.parentIdea){
      dimBeingEdited.ideas[this.id] = this.id;
      thisRaygun.get('dimension/' + dimBeingEdited.id).get('ideas').get(this.id).put(this.id)
    }
  }

}
