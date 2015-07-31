
  // counter starts at 0
  // Session.setDefault('counter', 0);

  // Template.hello.helpers({
  //   counter: function () {
  //     return Session.get('counter');
  //   }
  // });

var cellFindOne = function(rowNo, columnNo){
      return Cells.findOne({ row: rowNo, column:columnNo});
}
var cellFindCol= function(colNo){
      return Cells.find({ column: colNo },{ sort:{row: 1 }});
}
var cellFindRow= function(rowNo){
      return Cells.find({ row: rowNo },{ sort:{column: 1 }});
}
var updateWeight = function(){
      var weightArray = cellFindCol(1);
      var sum = 0;
      weightArray.forEach(function(cell){
        sum =sum + Number(cell.data);
      });
      cellFindCol(2).forEach(function(cell){
        Cells.update(cell._id,{$set: {data: cellFindOne(cell.row, 1).data/sum}});
      });
      // norWeightArray.forEach(function(cell){
      //   cell.data=Number(cell.data)/sum;
      // });
}
var updateTotal = function(){
      var totalArray = cellFindRow(-1);
 //     var norWeight = cellFindCol(2);
      //(0,3) (0,4) 
    //  console.log('here');
      totalArray.forEach(function(cell){
        var sum = 0;
        Col=cell.column;
        var scoreCol = cellFindCol(Col);
        //(:,3)
        scoreCol.forEach(function(cellInside){

          if (Number(cellInside.row)>= 1) {

            sum =sum + Number(cellFindOne(cellInside.row,2).data ) * Number(cellInside.data) ;

          };
        });
        Cells.update(cell._id,{$set: {data: sum}});
     });
}
//var factorCo=2;
//var candidateCo=2;

var proID='p4tETnfgHArySKLGJ';

  Template.matrix.helpers({
    cell: function () {
      updateWeight();
      updateTotal();
      return Cells.find();
    },
    cellFindRow: function(rowNo){
      return Cells.find({ row: rowNo },{ sort:{column: 1 }});
    },

    totalScore: function(columnNo,rowTotal){
      var totalValue = cellFindOne(2, 2);
      return totalValue.data;
    },
    //factorCo: 2,
    //candidateCo:2
  });
  Template.test.helpers({
    project: function () {
      
      return Projects.find();
    }
    //factorCo: 2,
    //candidateCo:2
  });

Template.celllist.events({
   'click .delete-cell': function(event) {
 
    event.preventDefault();
    var documentID = this._id;
    Cells.remove({_id: documentID});
    }
  });

Template.addingCan.events({
    'submit form': function(event){
    event.preventDefault();
    var thisProject = Projects.findOne({_id: proID});
    var canName = $('[name="canName"]').val();
    for (var i=-1;i<=Number(thisProject.rows);i++){
      if(i===0){
        Cells.insert({
        data: canName,
        row: 0,
        createdAt: new Date(),
        column: Number(thisProject.columns)+3
        });
      }else{
        Cells.insert({
        data: 0,
        row: i,
        createdAt: new Date(),
        column: Number(thisProject.columns)+3
        });
      }
    }
    Projects.update(
      proID,
      {$set: 
        {columns: 
          Number(thisProject.columns)+1
        }
      }
      );
    
    //console.log(candidateCo);
  }
});
Template.adding.events({
    'submit form': function(event){
    event.preventDefault();

    var rno = Number($('[name="rowNo"]').val());
    var cno = Number($('[name="colNo"]').val());
    Cells.insert({
    data: 0,
    row: rno,
    createdAt: new Date(),
    column: cno,
    projectID:"p4tETnfgHArySKLGJ"
    });
  }
});

Template.projectlist.events({
   'click .delete-project': function(event) {
 
    event.preventDefault();
    var documentID = this._id;
    Projects.remove({_id: documentID});
    }
  });