const app=angular.module("app",[])

app.controller("page-handler",['$scope','$http','$interval',($scope,$http,$interval)=>
{
    $scope.setRoute=root=>
    {
        $scope.root=root
    }
    /**
     * GET Table
     */
    $scope.getList=_=>
    {
        const url='/api/'+$scope.root+'/'
        $http.get(url)
        .then(response=>
        {
            $scope.data=response.data.data
        },
        error=>
        {
            console.log(error)
        })
    }
    /**
     * Active/Deactive Single at Table
     */
    $scope.setActiveTable=index=>
    {
        let _id=$scope.data[index]._id
        let url='/api/'+ $scope.root+'/'+_id
        $scope.data[index].disabled=true
        $http.patch(url,{data:{active:!$scope.data[index].active}})
        .then(response=>
        {
            delete $scope.data[index].disabled
            $scope.data[index].active=response.data.data.active
        },
        error=>
        {
            console.log(error)
        })
    }
    /**
     * Remove Single at Table
     */
    $scope.removeSingleTable=index=>
    {
        let _id=$scope.data[index]._id
        let url='/api/'+ $scope.root+'/'+_id
        $scope.data[index].disabled=true
        $http.delete(url)
        .then(response=>
        {
            if(response.data.status)
                $scope.data.splice(index,1)
        },
        error=>
        {
            console.log(error)
        })
    }
    
}])