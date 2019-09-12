const app=angular.module("app",[])
app.factory('httpRequestInterceptor',()=>
{
    return {
        request:config=>
        {
            const token=localStorage.getItem('token')
            if(token)
                config.headers['Authorization']='Bearer '+token
            return config
        }
    }
})
app.config(['$qProvider','$httpProvider','$compileProvider',($qProvider,$httpProvider,$compileProvider)=>
{
    $qProvider.errorOnUnhandledRejections(false)
	$httpProvider.interceptors.push('httpRequestInterceptor')
	$compileProvider.debugInfoEnabled(false)
}])
app.controller("page-handler",['$scope','$http','$interval',($scope,$http,$interval)=>
{
	$scope.token=localStorage.getItem('token')
	$scope.message={}
	$scope.signOut=_=>
	{
		localStorage.removeItem('token')
	}
	$scope.setRoute=root=>
	{
		$scope.root=root
	}
	/**
	 * GET Table
	 */
	$scope.getTable=_=>
	{
		$scope.message.info="Working..."
		delete $scope.message.success
		delete $scope.message.danger
		const url='/api/'+$scope.root+'/'
		$http.get(url)
		.then(response=>
		{
			$scope.data=response.data.data
			$scope.message.info="Operation complete"
			delete $scope.message.danger
			delete $scope.message.success
		},
		error=>
		{
			$scope.message.danger="Operation cannot complete"
			delete $scope.message.info
			delete $scope.message.success
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	/**
	 * Get Single Record
	 */
	$scope.getSingle=_id=>
	{
		$scope.message.info="Working..."
		delete $scope.message.success
		delete $scope.message.danger
		const url='/api/'+$scope.root+'/'+_id
		$http.get(url)
		.then(response=>
		{
			$scope.data=response.data.data
			$scope.message.info="Operation complete"
			delete $scope.message.danger
			delete $scope.message.success
		},
		error=>
		{
			$scope.message.danger="Operation cannot complete"
			delete $scope.message.info
			delete $scope.message.success
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	/**
	 *  Update Existing Record
	 */
	$scope.updateSingle=_id=>
	{
		$scope.message.info="Working..."
		delete $scope.message.success
		delete $scope.message.danger
		const url='/api/'+$scope.root+'/'+_id
		let data=$scope.data
		if(data.password=='')
			delete data.password
		data={data:data}
		$scope.disabled=true
		$http.patch(url,data)
		.then(response=>
		{
			$scope.data=response.data.data
			$scope.message.info="Operation complete"
			delete $scope.message.danger
			delete $scope.message.success
			$scope.disabled=false
		},
		error=>
		{
			$scope.message.danger="Operation cannot complete"
			delete $scope.message.info
			delete $scope.message.success
			$scope.disabled=false
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	/**
	 *  Insert new Record
	 */
	$scope.insertSingle=_=>
	{
		$scope.message.info="Working..."
		delete $scope.message.success
		delete $scope.message.danger
		const url='/api/'+$scope.root
		let data=$scope.data
		if(data.password=='')
			delete data.password
		data={data:data}
		$scope.disabled=true
		$http.put(url,data)
		.then(response=>
		{
			$scope.data=response.data.data
			$scope.message.info="Operation complete"
			delete $scope.message.danger
			delete $scope.message.success
			$scope.disabled=false
			window.location.href='/administrator/'+$scope.root
		},
		error=>
		{
			$scope.message.danger="Operation cannot complete"
			delete $scope.message.info
			delete $scope.message.success
			$scope.disabled=false
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	/**
	 * Active/Deactive Single at Table
	 */
	$scope.setActiveTable=index=>
	{
		$scope.message.info="Working..."
		delete $scope.message.success
		delete $scope.message.danger
		let _id=$scope.data[index]._id
		let url='/api/'+ $scope.root+'/'+_id
		$scope.data[index].disabled=true
		$http.patch(url,{data:{active:!$scope.data[index].active}})
		.then(response=>
		{
			delete $scope.data[index].disabled
			$scope.data[index].active=response.data.data.active
			$scope.message.success="Operation completed successfully"
			delete $scope.message.info
			delete $scope.message.danger
		},
		error=>
		{
			$scope.message.danger="Operation cannot complete"
			delete $scope.message.info
			delete $scope.message.success
			delete $scope.data[index].disabled
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	/**
	 * Remove Single at Table
	 */
	$scope.removeSingleTable=index=>
	{
		let conf=confirm("Are you sure?")
		if(conf)
		{
			$scope.message.info="Working..."
			delete $scope.message.success
			delete $scope.message.danger
			let _id=$scope.data[index]._id
			let url='/api/'+ $scope.root+'/'+_id
			$scope.data[index].disabled=true
			$http.delete(url)
			.then(response=>
			{
				if(response.data.status)
				{
					$scope.data.splice(index,1)
					$scope.message.success="Operation completed successfully"
					delete $scope.message.info
					delete $scope.message.danger
				}
				else
				{
					$scope.message.danger="Operation cannot complete"
					delete $scope.message.info
					delete $scope.message.success
					delete $scope.data[index].disabled
				}
			},
			error=>
			{
				$scope.message.danger="Operation cannot complete"
				delete $scope.message.info
				delete $scope.message.success
				delete $scope.data[index].disabled
				console.log(error)
				if(error.status==401)
					window.location.href="/administrator/administrator/signIn"
			})
		}
	}
	$scope.removeImage=_id=>
	{
		let url='/api/'+ $scope.root+'/remove-image/'+_id
		$http.patch(url)
		.then(response=>
		{
			if(response.data.data.images)
				$scope.data.images=response.data.data.images
			else
				$scope.data.images=[]
		},
		error=>
		{
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	$scope.insertImage=_id=>
	{
		var fd=new FormData()
		if($('#from-image').length>0)
		   fd.append('image', $('#from-image')[0].files[0])
		let url='/api/'+$scope.root+'/upload-image/'+_id
		$scope.uploadImageVar={uploading:true,val:0,per:0+'%'}
		$http({
                url:url,
                headers:{"Content-Type":undefined},
                data: fd,
                method: "patch",
                transformRequest: angular.identity,
                uploadEventHandlers:
                {
                    progress:(e)=>
                    {
                        if(e.lengthComputable)
                        {
                            var val=((e.loaded/e.total)*100).toFixed(0)
                            $scope.uploadImageVar={uploading:true,val:val,per:val+'%'}
						}
                    }
                }
        })
		.then(response=>
		{
			if(response.data.data.images)
				$scope.data.images=response.data.data.images
			$scope.message.success="Operation completed successfully"
			delete $scope.message.info
			delete $scope.message.danger
			$scope.uploadImageVar={uploading:false,val:100,per:'100%'}
		}, 
		error=>
		{
			console.log(error)
			$scope.message.danger="Operation cannot complete"
			delete $scope.message.info
			delete $scope.message.success
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	$scope.administratorLogin=_=>
	{
		let url='/api/administrator/signIn'
		$http.post(url,{data:{email:$scope.data.email,password:$scope.data.password}})
		.then(response=>
		{
			if(response.data.error)
			{
				console.log(response.data.error)
				$scope.message.danger=response.data.error.message
				delete $scope.message.info
				delete $scope.message.success
			}
			else
			{
				localStorage.setItem('token',response.data.data.token)
				window.location="/administrator"
			}
		},
		response=>
		{
			console.log(response)
			$scope.message.danger=response.data.error.message
			delete $scope.message.info
			delete $scope.message.success
			if(response.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
}])