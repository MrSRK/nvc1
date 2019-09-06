const app=angular.module("app",[])

app.controller("page-handler",['$scope','$http','$interval',($scope,$http,$interval)=>
{
    $scope.setRoute=root=>
    {
        $scope.root=root
    }
    $scope.getList=_=>
    {
        const url='/api/'+$scope.root+'/'
        $http.get(url)
        .then(response=>
        {
            console.log(response)
                $scope.data=response.data.data
        },
        error=>
        {
            console.log(error)
        })
    }
}])