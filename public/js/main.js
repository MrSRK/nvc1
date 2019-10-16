const app=angular.module("app",[])
app.factory('httpRequestInterceptor',()=>
{
    return {
        request:config=>
        {
            const token=localStorage.getItem('token')
            if(typeof token!=undefined&&token)
                config.headers['Authorization']='Bearer '+token
            return config
        }
    }
})
app.config(['$qProvider','$httpProvider','$compileProvider',($qProvider,$httpProvider,$compileProvider)=>
{
    $qProvider.errorOnUnhandledRejections(false)
	$httpProvider.interceptors.push('httpRequestInterceptor')
}])
app.controller("page-handler",['$scope','$http','$interval',($scope,$http,$interval)=>
{
	const parseToken=(data)=>
	{
		if(data&&data.token)
			localStorage.setItem('token',data.token)
		$scope.token=localStorage.getItem('token')||null
		if($scope.token&&$scope.token!='')
		{
			const dtoken=JSON.parse(window.atob($scope.token.split('.')[1]))
			const extime=new Date(dtoken.exp*1000).getTime()
			const time=new Date().getTime()
			var exp=((extime-time)/1000).toFixed(0)
			$scope.user={
				name:decodeURIComponent(dtoken.userName),
				exp:exp,
				m:parseInt(exp/60,10),
				s:exp%60
			}
			localStorage.setItem('userTimer',JSON.stringify($scope.user))
		}
	}
	$scope.data={}
	$scope.asideData={}
	parseToken()
	if($scope.token)
	{
		$interval(_=>
		{
			let user=JSON.parse(localStorage.getItem('userTimer'))
			if(JSON.stringify($scope.user)!=JSON.stringify(user))
				$scope.user=user
			if($scope.user.exp--<=1)
			{
				this.stop()
				$scope.signOut()
			}
			$scope.user.m=parseInt($scope.user.exp/60,10)
			$scope.user.s=$scope.user.exp%60
			localStorage.setItem('userTimer',JSON.stringify($scope.user))
		},1000)
	}
	$scope.message={}
	$scope.signOut=_=>
	{
		localStorage.removeItem('token')
		window.location.href="/administrator/administrator/signIn"
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
		setMessage('alert-info','Info','Working...')
		const url='/api/1/'+$scope.root+'/'
		$http.get(url)
		.then(response=>
		{
			$scope.data=response.data.data
			setMessage('alert-info','Info','Operation complete')
			if(response.data.token)
				parseToken(response.data)
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	/**
	 * GET List
	 */
	$scope.getList=_=>
	{
		setMessage('alert-info','Info','Working...')
		const url='/api/2/'+$scope.root+'/'
		$http.get(url)
		.then(response=>
		{
			$scope.data=response.data.data
			setMessage('alert-info','Info','Operation complete')
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	/**
	 * Get Single Record
	 */
	$scope.getSingle=(_id,auth=false)=>
	{
		setMessage('alert-info','Info','Working')
		authNo=auth?1:2
		const url='/api/'+authNo+'/'+$scope.root+'/'+_id
		$http.get(url)
		.then(response=>
		{
			$scope.data=response.data.data
			setMessage('alert-info','Info','Operation complete')
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
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
		setMessage('alert-info','Info','Working')
		const url='/api/1/'+$scope.root+'/'+_id
		let data=$scope.data
		if(data.password=='')
			delete data.password
		data={data:data}
		$scope.disabled=true
		$http.patch(url,data)
		.then(response=>
		{
			setMessage('alert-info','Info','Operation complete')
			$scope.disabled=false
			//Renew Token
			if(response.data.token)
				parseToken(response.data)
			window.location.href="/administrator/"+$scope.root+"/"
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
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
		setMessage('alert-info','Info','Working...')
		const url='/api/1/'+$scope.root
		let data=$scope.data
		if(data.password=='')
			delete data.password
		data={data:data}
		$scope.disabled=true
		$http.put(url,data)
		.then(response=>
		{
			$scope.data=response.data.data
			setMessage('alert-info','Info','Operation complete')
			$scope.disabled=false
			window.location.href='/administrator/'+$scope.root
			//Renew Token
			if(response.data.token)
				parseToken(response.data)
			window.location.href="/administrator/"+$scope.root+"/"+response.data.data._id
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
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
		setMessage('alert-info','Info','Working...')
		let _id=$scope.data[index]._id
		let url='/api/1/'+ $scope.root+'/'+_id
		$scope.data[index].disabled=true
		$http.patch(url,{data:{active:!$scope.data[index].active}})
		.then(response=>
		{
			delete $scope.data[index].disabled
			$scope.data[index].active=response.data.data.active
			setMessage('alert-success','Success','Operation completed successfully')
			//Renew Token
			if(response.data.token)
				parseToken(response.data)
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
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
			setMessage('alert-info','Info','Working...')
			let _id=$scope.data[index]._id
			let url='/api/1/'+ $scope.root+'/'+_id
			$scope.data[index].disabled=true
			$http.delete(url)
			.then(response=>
			{
				if(response.data.status)
				{
					$scope.data.splice(index,1)
					setMessage('alert-success','Success','Operation completed successfully')
					//Renew Token
					if(response.data.token)
						parseToken(response.data)
				}
				else
				{
					setMessage('alert-danger','Error','Operation cannot complete')
					delete $scope.data[index].disabled
				}
			},
			error=>
			{
				setMessage('alert-danger','Error','Operation cannot complete')
				delete $scope.data[index].disabled
				console.log(error)
				if(error.status==401)
					window.location.href="/administrator/administrator/signIn"
			})
		}
	}
	$scope.removeImage=_id=>
	{
		let url='/api/1/'+ $scope.root+'/remove-image/'+_id
		$http.patch(url)
		.then(response=>
		{
			if(response.data.data.images)
				$scope.data.images=response.data.data.images
			else
				$scope.data.images=[]
			//Renew Token
			if(response.data.token)
				parseToken(response.data)
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
		let url='/api/1/'+$scope.root+'/upload-image/'+_id
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
			setMessage('alert-success','Success','Operation completed successfully')
			$scope.uploadImageVar={uploading:false,val:100,per:'100%'}
			//Renew Token
			if(response.data.token)
				parseToken(response.data)
		},
		error=>
		{
			console.log(error)
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	$scope.administratorLogin=_=>
	{
		let url='/api/1/administrator/signIn'
		$http.post(url,{data:{email:$scope.data.email,password:$scope.data.password}})
		.then(response=>
		{
			if(response.data.error)
			{
				console.log(response.data.error)
				setMessage('alert-error','Error',response.data.error.message)
			}
			else
			{
				localStorage.setItem('token',response.data.data.token)
				console.log(response.data.data)
				window.location="/administrator"
			}
		},
		response=>
		{
			console.log(response)
			setMessage('alert-error','Error',response.data.error.message)
			if(response.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	$scope.loadAside=model=>
	{
		if(!$scope.asideData[model])
			$scope.asideData[model]=[]
		setMessage('alert-info','Info','Working...')
		const url='/api/1/'+model+'/'
		$http.get(url)
		.then(response=>
		{
			$scope.asideData[model]=response.data.data
			setMessage('alert-info','Info','Operation complete')
			if(response.data.token)
				parseToken(response.data)
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			console.log(error)
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
		})
	}
	$scope.deleteAsideOnData=model=>
	{
		delete $scope.data[model]
	}
	$scope.permalink=_=>
	{
		return window.location.href
	}


	/*
	*
	* NEW PART
	*
	*/
	const setMessage=(className,title,description)=>
	{
		console.log('Seting message')
		$scope.msg={
			show:true,
			class:className,
			title:title,
			description:description
		}
	}
}])