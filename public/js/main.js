/**
 * Initialize angular module
 */
const app=angular.module("app",[])
/**
 * If login token exists: set Authorization token to all requests
 */
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
/**
 *
 */
app.config(['$qProvider','$httpProvider',($qProvider,$httpProvider)=>
{
    $qProvider.errorOnUnhandledRejections(false)
	$httpProvider.interceptors.push('httpRequestInterceptor')
}])
/**
 * Main site default controller
 */
app.controller("page-handler",['$scope','$http','$interval',($scope,$http,$interval)=>
{
	/**
	 * Prints Error to log
	 * @param {object} error
	 */
	const logError=error=>
	{
		console.error('Error:')
		console.log(error)
	}
	/**
	 * Set Route From page to $Scope
	 * @param {String} root
	 * @returns {boolean}
	 */
	const setRoute=root=>
	{
		try
		{
			$scope.root=root
			return true
		}
		catch(error)
		{
			logError(error);
			return false
		}
	}
	/**
	 * Remouve token from local storeage and redirect to (Administrator) login page
	 * @returns {boolean}
	 */
	const signOut=()=>
	{
		try
		{
			localStorage.removeItem('token')
			window.location.href="/administrator/administrator/signIn"
			return true
		}
		catch(error)
		{
			logError(error);
			return false
		}
	}
	const ajaxGet2scope=(url)=>
	{
		try
		{
			setMessage('alert-info','Info','Working...')
			return $http.get(url)
			.then(response=>
			{
				$scope.data=response.data.data
				setMessage('alert-info','Info','Operation complete')
				if(response.data.token)
					parseToken(response.data)
			},
			error=>
			{
				throw(error)
			})
		}
		catch(error)
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		}
	}
	const ajaxPatch2scope=(url,data,next)=>
	{
		try
		{
			setMessage('alert-info','Info','Working')
			$scope.disabled=true
			return $http.patch(url,data)
			.then(response=>
			{
				setMessage('alert-info','Info','Operation complete')
				$scope.disabled=false
				if(response.data.token)
					parseToken(response.data)
				return next(response.data)
			},
			error=>
			{
				throw(error)
			})
		}
		catch(error)
		{
			$scope.disabled=false
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		}
	}
	const ajaxPut2scope=(url,data,next)=>
	{
		setMessage('alert-info','Info','Working...')
		$scope.disabled=true
		return $http.put(url,data)
		.then(response=>
		{
			$scope.data=response.data.data
			setMessage('alert-info','Info','Operation complete')
			$scope.disabled=false
			if(response.data.token)
				parseToken(response.data)
			return next($scope.data)
		},
		error=>
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			$scope.disabled=false
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		})
	}
	/**
	 * Set to $scope.data the response of (login) model's (data) table
	 * @returns {boolean}
	 */
	const getTable=()=>
	{
		return ajaxGet2scope('/api/1/'+$scope.root+'/')
	}
	/**
	 * Set to $scope data the response of model's (data) List
	 * @returns {boolean}
	 */
	const getList=()=>
	{
		return ajaxGet2scope('/api/2/'+$scope.root+'/')
	}
	/**
	 * Set to $scope data the response of model's (data) Single record
	 * @param {String} _id
	 */
	const getSingle=(_id,auth=false)=>
	{
		return ajaxGet2scope('/api/'+(auth?1:2)+'/'+$scope.root+'/'+_id)
	}
	/**
	 * Update model's (single) record and and redirect to model's table
	 * @param {String} _id
	 */
	const updateSingle=_id=>
	{
		let data={data:$scope.data}
		if(data.data.password=='')
			delete data.data.password
		return ajaxPatch2scope('/api/1/'+$scope.root+'/'+_id,data,d=>
		{
			window.location.href="/administrator/"+$scope.root+"/"
			return true
		})
	}
	/**
	 * Insert single record to Model
	 * @returns {boolean}
	 */
	const insertSingle=()=>
	{
		let data={data:$scope.data}
		if(data.data.password=='')
			delete data.data.password
		return ajaxPut2scope('/api/1/'+$scope.root,data,d=>
		{
			window.location.href="/administrator/"+$scope.root+"/"+d._id
			return true
		})
	}
	/**
	 * Change active flag to single model's record
	 * @param {Number} index
	 * @returns {Boolean}
	 */
	const setActiveTable=index=>
	{
		let _id=$scope.data[index]._id
		$scope.data[index].disabled=true
		return ajaxPatch2scope('/api/1/'+ $scope.root+'/'+_id,{data:{active:!$scope.data[index].active}},d=>
		{
			delete $scope.data[index].disabled
			$scope.data[index].active=d.data.active
			return true
		})
	}
	/**
	 * Remove Single mode's Record
	 * @param {Number} index
	 * @returns {Boolean}
	 */
	const removeSingleTable=index=>
	{
		try
		{
			let conf=confirm("Are you sure?")
			if(conf)
			{
				setMessage('alert-info','Info','Working...')
				$scope.data[index].disabled=true
				return $http.delete('/api/1/'+ $scope.root+'/'+$scope.data[index]._id)
				.then(response=>
				{
					if(response.data.status)
					{
						$scope.data.splice(index,1)
						setMessage('alert-success','Success','Operation completed successfully')
						if(response.data.token)
							parseToken(response.data)
						return true
					}
					else
						throw('Response error')
				},
				error=>
				{
					delete $scope.data[index].disabled
					if(error.status==401)
						throw(error)
				})
			}
		}
		catch(error)
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		}
	}
	/**
	 * Remove single image (by image _id) from model's record
	 * @param {String} _id
	 * @returns {Boolean}
	 */
	const removeImage=_id=>
	{
		try
		{
			$http.patch('/api/1/'+ $scope.root+'/remove-image/'+_id)
			.then(response=>
			{
				if(response.data.data.images)
					$scope.data.images=response.data.data.images
				else
					$scope.data.images=[]
				if(response.data.token)
					parseToken(response.data)
			},
			error=>
			{
				throw(error)
			})
		}
		catch(error)
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		}
	}
	/**
	 * Insert single image to models record
	 * @param {String} _id
	 * @returns {Boolean}
	 */
	const insertImage=_id=>
	{
		try
		{
			var fd=new FormData()
			if($('#from-image').length>0)
			fd.append('image', $('#from-image')[0].files[0])
			$scope.uploadImageVar={uploading:true,val:0,per:0+'%'}
			return $http({
					url:'/api/1/'+$scope.root+'/upload-image/'+_id,
					headers:{"Content-Type":undefined},
					data: fd,
					method: "patch",
					transformRequest: angular.identity,
					uploadEventHandlers:
					{
						progress:e=>
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
				if(response.data.token)
					parseToken(response.data)
			},
			error=>
			{
				throw(error)
			})
		}
		catch(error)
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		}

	}
	/**
	 * Request Administrator login token
	 * @returns {Boolean}
	 */
	const administratorLogin=()=>
	{
		try
		{
			return $http.post('/api/2/administrator/signIn',{data:{email:$scope.data.email,password:$scope.data.password}})
			.then(response=>
			{
				if(response.data.error)
				{
					logError(response.data.error)
					setMessage('alert-error','Error',response.data.error.message)
					return false
				}
				localStorage.setItem('token',response.data.data.token)
				window.location="/administrator"
				return true
			},
			response=>
			{
				throw(response)
			})
		}
		catch(error)
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		}
	}
	/**
	 * Load aside data for target model
	 * @param {String} model
	 * @returns {Boolean}
	 */
	const loadAside=model=>
	{
		try
		{
			if(!$scope.asideData[model])
				$scope.asideData[model]=[]
			setMessage('alert-info','Info','Working...')
			return $http.get('/api/1/'+model+'/')
			.then(response=>
			{
				$scope.asideData[model]=response.data.data
				setMessage('alert-info','Info','Operation complete')
				if(response.data.token)
					parseToken(response.data)
			},
			error=>
			{
				throw(error)
			})
		}
		catch(error)
		{
			setMessage('alert-danger','Error','Operation cannot complete')
			if(error.status==401)
				window.location.href="/administrator/administrator/signIn"
			logError(error)
			return false
		}
	}
	/**
	 * Remove aside data for target model (at $scope)
	 * @param {String} model
	 * @returns {void}
	 */
	const deleteAsideOnData=model=>
	{
		delete $scope.data[model]
	}
	/**
	 * Return current location link
	 * @returns {String}
	 */
	const permalink=()=>
	{
		return window.location.href
	}
	/**
	 * Set message args to scope (alert messages)
	 * @param {String} className
	 * @param {String} title
	 * @param {String} description
	 */
	const setMessage=(className,title,description)=>
	{
		$scope.msg={
			show:true,
			class:className,
			title:title,
			description:description
		}
	}
	/**
	 * Check and store / renew login token to local storage
	 * @param {Object} data
	 * @returns {void}
	 */
	const parseToken=data=>
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
	/**
	 * Initialise $scope
	 */
	$scope.data={}
	$scope.asideData={}
	$scope.msg={}
	/**
	 * Bypass functions to scope
	 */
	$scope.signOut=signOut
	$scope.setRoute=setRoute
	$scope.getTable=getTable
	$scope.getList=getList
	$scope.getSingle=getSingle
	$scope.updateSingle=updateSingle
	$scope.insertSingle=insertSingle
	$scope.setActiveTable=setActiveTable
	$scope.removeSingleTable=removeSingleTable
	$scope.removeImage=removeImage
	$scope.insertImage=insertImage
	$scope.administratorLogin=administratorLogin
	$scope.loadAside=loadAside
	$scope.deleteAsideOnData=deleteAsideOnData
	$scope.permalink=permalink
	/**
	 * Inittilize token
	 */
	parseToken()
	/**
	 * If token exist start timer for autologout (token expire)
	 */
	if($scope.token)
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
			if(typeof $scope.user.exp===undefined)
			{
				this.stop()
				$scope.signOut()
			}
			$scope.user.m=parseInt($scope.user.exp/60,10)
			$scope.user.s=$scope.user.exp%60
			localStorage.setItem('userTimer',JSON.stringify($scope.user))
		},1000)
}])