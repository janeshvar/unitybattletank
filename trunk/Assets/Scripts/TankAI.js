@script RequireComponent(CharacterController)

private var tankList : GameObject[];
private var target : GameObject;
private var canTravel : boolean[] = new boolean[4]; // N E W S directions (orientated for the tank)
private var canTravelBackLeft : boolean[] = new boolean[4];
private var canTravelFrontLeft : boolean[] = new boolean[4];
private var canTravelBackRight : boolean[] = new boolean[4];
private var canTravelFrontRight : boolean[] = new boolean[4];
private var hasTraveled : boolean[] = new boolean[4]; // Recoreds the previous environment scan results
private var extraCanTravel : boolean[] = new boolean[4];
private var extraHasTraveled : boolean[] = new boolean[4];
private var isTurning : boolean[] = new boolean[2]; // Right & left turn bools, respectively
private var oldRotation : float = 0;
private var shootScript : FireProjectile;
private var rigidBody : Rigidbody;
private var charController : CharacterController;

var enemyCheckDelay : int = 0; // 1 skips 1 frame, 2 skps 2 frames, etc...
private var currEnemyCheck : int = 0; // Private counter - ignore

var locationCheckDelay : int = 0; // 1 skips 1 frame, 2 skips 2 frames, etc...
private var currLocationCheck : int = 0; // Private counter - ignore

var moveSpeed : float;
var rotationSpeed : float;
var closestAttackDistance : float;


function Start () {
	var tempTankList : GameObject[];
	tempTankList = GameObject.FindGameObjectsWithTag("Tank");
	tankList = new GameObject[tempTankList.length - 1];
	
	var counter : int = 0;
	for(var i : int = 0; i < tempTankList.length; i++) {
		if(tempTankList[i] != gameObject) {
			tankList[counter] = tempTankList[i];
			counter++;
		}
	}
	
	shootScript = gameObject.GetComponent(FireProjectile);
	rigidBody = gameObject.GetComponentInChildren(Rigidbody);
	charController = gameObject.GetComponent(CharacterController);
	
	//if(!gameObject.GetComponent(SimpleCharacterControl)) { // Uncomment to have TankAI script ignore players
		while(true) {
		//while(false) { // Swap this with the line above it to execute the Update() function, else it'll never be called
			yield PingPlayers(); // If we don't want to implement this, we should just remove it
			yield Explore();
			yield Attack();
		}
	//} // Uncomment to have TankAI script ignore players
}


function Update() {
	// This is never called unless the loop above exits
	
}


function PingPlayers() {
	
	yield;
}


function Explore() {
	while(true) {
		var myPos : Vector3;
		var angle : float;
		var dist : float = 0.10; // Distance from center of tank to check for walls
		var horizDist : float = 0.20;
		var extraDist : float = 1.5; // Further check to see if there is something just ahead of an intersection
		var vertOffset : float = 0.3; // Offset to check for path clearance
		var horizOffset : float = 0.20; // Offset to check for path clearance
		var initOffset : float = 0.35; // This compensates to make transform.position in center of tank image
		
		myPos = transform.position + initOffset * transform.forward;
		
		while(isTurning[0] || isTurning[1]) { // While turning
			var newRotation : float = oldRotation;
			if(isTurning[0]) { // Turning right
				newRotation = (oldRotation + 90) % 360;
				transform.eulerAngles = Vector3(0, transform.eulerAngles.y + Mathf.Clamp(Mathf.Abs(Mathf.DeltaAngle(transform.eulerAngles.y, newRotation)), 0, rotationSpeed*(180.0/Mathf.PI)*Time.deltaTime), 0);
			} else { // Turning left
				newRotation = (oldRotation - 90) % 360;
				transform.eulerAngles = Vector3(0, transform.eulerAngles.y - Mathf.Clamp(Mathf.Abs(Mathf.DeltaAngle(transform.eulerAngles.y, newRotation)), 0, rotationSpeed*(180.0/Mathf.PI)*Time.deltaTime), 0);
			}
			
			yield;
			
			if(Mathf.Abs(Mathf.DeltaAngle(transform.eulerAngles.y, newRotation)) < 0.01) // If aligned towards the new direction
				isTurning[0] = isTurning[1] = false;
		}
		
		// if we're not aligned to a 90 degree multiple, align
		while(Mathf.Abs(transform.eulerAngles.y % 90) > 0.01) {
			// find the smallest (closest) 90 degree angle
			var smallestAngle : float = 360.0;
			var smallestDir : int = 0;
			for(var dir : int=0; dir<4; dir++) {
				var thisAngle : float = Mathf.Abs(Mathf.DeltaAngle(transform.eulerAngles.y, dir*90));
				if(thisAngle < smallestAngle) {
					smallestAngle = thisAngle;
					smallestDir = dir;
				}
			}
			
			// rotate towards that nearest 90 degree multiple angle
			transform.eulerAngles = Vector3(0, transform.eulerAngles.y + Mathf.Clamp(Mathf.DeltaAngle(transform.eulerAngles.y, smallestDir*90), -(rotationSpeed*(180.0/Mathf.PI)*Time.deltaTime), (rotationSpeed*(180.0/Mathf.PI)*Time.deltaTime)), 0);
			
			// yield so we keep turning until we reach the 90 degree multiple
			yield;
		}
		
		// Search for any visible tanks
		if(currEnemyCheck >= enemyCheckDelay) {
			for(var i : int = 0; i < tankList.length; i++) {
				var rayInfo : RaycastHit;
				if(!Physics.Linecast(myPos, tankList[i].transform.position + initOffset * tankList[i].transform.forward, rayInfo)) {
					// Our guns have lign of sight, now lets check for the back of our tanks to make sure we can rotate around corners properly
					if(!Physics.Linecast(transform.position - initOffset / 2 * transform.forward, tankList[i].transform.position - initOffset / 2 * tankList[i].transform.forward, rayInfo)) {
						// This would return true if something collided, so, if false, then we have a clear shot!
						target = tankList[i]; // Save target info for later when we persue him
						return; // This escapes the yield in the state machine
					}
				}
			}
			currEnemyCheck = 0;
		} else {
			currEnemyCheck++;
		}
		
		// No tanks found, we need to search our surroundings
		if(currLocationCheck >= locationCheckDelay) {
			var ninetyDegreeTurn : Quaternion = Quaternion.Euler(0,90,0);
			var right : Vector3 = ninetyDegreeTurn * transform.forward;
			var back : Vector3 = ninetyDegreeTurn * right;
			var left : Vector3 = ninetyDegreeTurn * back;
			
			
			myPos = transform.position + (initOffset + vertOffset) * transform.forward + horizOffset * left;
			canTravelFrontLeft[0] = !Physics.Raycast(myPos, transform.forward, dist);
					//Debug.DrawRay(myPos, transform.forward * dist);
			canTravelFrontLeft[1] = true; // Assume true, but we'll check this on the right end
			canTravelFrontLeft[2] = !Physics.Raycast(myPos, left, dist + horizDist);
					//Debug.DrawRay(myPos, left * (dist + horizDist));
			canTravelFrontLeft[3] = true; // Assume true, but we'll check this on the back end
			
			myPos = transform.position + (initOffset - vertOffset) * transform.forward + horizOffset * left;
			canTravelBackLeft[0] = true; // Assume true, but we'll check this on the front end
			canTravelBackLeft[1] = true; // Assume true, but we'll check this on the right end
			canTravelBackLeft[2] = !Physics.Raycast(myPos, left, dist + horizDist);
					//Debug.DrawRay(myPos, left * (dist + horizDist));
			canTravelBackLeft[3] = !Physics.Raycast(myPos, back, dist);
					//Debug.DrawRay(myPos, transform.forward * -dist);
			
			
			myPos = transform.position + (initOffset + vertOffset) * transform.forward + horizOffset * right;
			canTravelFrontRight[0] = !Physics.Raycast(myPos, transform.forward, dist);
					//Debug.DrawRay(myPos, transform.forward * dist);
			canTravelFrontRight[1] = !Physics.Raycast(myPos, right, dist + horizDist);
					//Debug.DrawRay(myPos, right * (dist + horizDist));
			canTravelFrontRight[2] = true; // Assume true, but we'll check this on the left end
			canTravelFrontRight[3] = true; // Assume true, but we'll check this on the back end
			
			myPos = transform.position + (initOffset - vertOffset) * transform.forward + horizOffset * right;
			canTravelBackRight[0] = true; // Assume true, but we'll check this on the front end
			canTravelBackRight[1] = !Physics.Raycast(myPos, right, dist + horizDist);
					//Debug.DrawRay(myPos, right * (dist + horizDist));
			canTravelBackRight[2] = true; // Assume true, but we'll check this on the left end
			canTravelBackRight[3] = !Physics.Raycast(myPos, back, dist);
					//Debug.DrawRay(myPos, transform.forward * -dist);
			
			
			
			myPos = transform.position + initOffset * transform.forward;
			extraCanTravel[0] = !Physics.Raycast(myPos, transform.forward, extraDist);
					//Debug.DrawRay(myPos, transform.forward * extraDist, Color.red);
			extraCanTravel[1] = !Physics.Raycast(myPos, right, extraDist);
					//Debug.DrawRay(myPos, right * extraDist, Color.red);
			extraCanTravel[2] = !Physics.Raycast(myPos, left, extraDist);
					//Debug.DrawRay(myPos, left * extraDist, Color.red);
			extraCanTravel[3] = !Physics.Raycast(myPos, back, extraDist);
					//Debug.DrawRay(myPos, transform.forward * -extraDist, Color.red);
			
			for(i = 0; i < 4; i++)
				canTravel[i] = canTravelFrontLeft[i] && canTravelBackLeft[i] && canTravelFrontRight[i] && canTravelBackRight[i];
			
			//for(i = 0; i < 4; i++)
			//	if(canTravel[i])
			//		Debug.Log("I can travel in direction: " + i);
			
			currLocationCheck = 0;
		} else {
			currLocationCheck++;
		}
		
		// Now, we need to choose a random direction from the above list and head that way
		// We should probably remember what we saw on the last update, so that we can detect when
		// the number of directions available changes.  If it increases, we're at an intersection, and we need
		// to choose a new direction to head.  If it decreases, we either just got out of an intersection or we just
		// ran into a corner.  We also might want to remember which direction we were heading, so we can prevent
		// the tank from returning from where it came unless its the only direction available.
		
		var hasChanged : boolean = false;
		var moreOptions : boolean = false;
		var newCount : int = 0;
		var oldCount : int = 0;
		for(i = 0; i < 4; i++) {
			if(hasTraveled[i] != canTravel[i]) {
				if(hasTraveled[i]) // Doing it this way allows us to turn a corner and not immediately turn again
					oldCount++;   // since we'll detect the exact same number of directions we can go, despite
				if(canTravel[i])   // the fact that the actual directions are different.  For instance, at a T intersection,
					newCount++; // we'll have 3 directions we can go, regardless of orientation.
				hasTraveled[i] = canTravel[i]; // Set the old values here because its convienent
				hasChanged = true;
			}
			/*if(extraHasTraveled[i] != extraCanTravel[i]) {
				if(extraHasTraveled[i])
					oldCount++;
				if(extraCanTravel[i])
					newCount++;
				extraHasTraveled[i] = extraCanTravel[i];
				hasChanged = true;
			}*/
		}
		if(hasChanged) {
			if(newCount > oldCount) {
				moreOptions = true;
			}
			if(moreOptions) { // If there are more directions we can go, we'll have to choose one
				var newDir : int = Mathf.FloorToInt(Random.value * 2.99);
				while(!canTravel[newDir] || !extraCanTravel[newDir]) {
					newDir = Mathf.FloorToInt(Random.value * 2.99);
				}
				for(i = 0; i < 3; i++) {
					if(i != newDir)
						canTravel[i] = false;
				}
			}
		}
		
		
		if(canTravel[0]) { // Can move forward
			// Move forward in direction the tank is facing
			var prevY : float = transform.position.y;
			moveDirection = Vector3(0,0,1);
			moveDirection = transform.TransformDirection(moveDirection);
    		charController.Move(moveDirection * (Time.deltaTime * moveSpeed));
			transform.position.y = prevY;
    		
		} else if(canTravel[1]) { // Can turn right
			oldRotation = transform.eulerAngles.y;
			isTurning[0] = true;
		} else if(canTravel[2]) { // Can turn left
			oldRotation = transform.eulerAngles.y;
			isTurning[1] = true;
		} else if(canTravel[3]) { // If we're in a corner, just turn right and reevaluate
			oldRotation = transform.eulerAngles.y;
			isTurning[0] = true;
		}
		
		yield;
	}
	
}


function Attack() {
	var isVisible : boolean = true;
	while(target && isVisible) {
		// If they are turned closer to us, than we are to them, we need to run!
		// If we are turned closer to them, finish turning and FIRE (while moving closer)
		var previousY : float = transform.position.y;
		
		var targetPos : Vector3 = target.transform.position;
		targetPos.y = transform.position.y; // do not allow our tank to rotate up or down
		var lineOfSight : Vector3 = targetPos - gameObject.transform.position;
		
		// maxPositionOffset is the maximum forward movement vector for this frame
		var maxPositionOffset : Vector3 = transform.forward * Time.deltaTime * moveSpeed;
		// distanceLeft is negative if we're too close to the enemy and should back up
		var distanceLeft : float = lineOfSight.magnitude - closestAttackDistance;
		var maxTravelDistance : float = maxPositionOffset.magnitude;
		maxPositionOffset.Normalize();
		maxPositionOffset *= Mathf.Clamp(distanceLeft, -maxTravelDistance, maxTravelDistance);
		
		
		
		var oldEuler : Vector3 = transform.eulerAngles;
		transform.eulerAngles = Vector3(0, oldEuler.y + Mathf.Clamp(rotationSpeed * (180.0/Mathf.PI) * Time.deltaTime, 0, Vector3.Angle(transform.forward, targetPos - (transform.position + 0.35 * transform.forward))), 0);
		var turnAngle : float = Vector3.Angle(transform.forward, targetPos - (transform.position + 0.35 * transform.forward));
		transform.eulerAngles = oldEuler;
		transform.eulerAngles = Vector3(0, oldEuler.y - Mathf.Clamp(rotationSpeed * (180.0/Mathf.PI) * Time.deltaTime, 0, Vector3.Angle(transform.forward, targetPos - (transform.position + 0.35 * transform.forward))), 0);
		Debug.Log("Curr: " + turnAngle + " - and other: " + Vector3.Angle(transform.forward, targetPos - (transform.position + 0.35 * transform.forward)));
		if(turnAngle < Vector3.Angle(transform.forward, targetPos - (transform.position + 0.35 * transform.forward))) {
			transform.eulerAngles = oldEuler;
			transform.eulerAngles = Vector3(0, oldEuler.y + Mathf.Clamp(rotationSpeed * (180.0/Mathf.PI) * Time.deltaTime, 0, Vector3.Angle(transform.forward, targetPos - (transform.position + 0.35 * transform.forward))), 0);
			
		}
		// rotate towards the enemy tank
		lineOfSight.Normalize();
		var newForward : Vector3 = Vector3.RotateTowards(transform.forward, lineOfSight, rotationSpeed * Time.deltaTime, 0.0);
		//transform.forward = newForward;
		//charController.Move(maxPositionOffset);
		
		if(Vector3.Angle(transform.forward, targetPos - (transform.position + 0.35 * transform.forward)) < 1) {
			//charController.Move(maxPositionOffset);
			shootScript.ShootCannon();
		}
		
		transform.position.y = previousY;
		yield;
		isVisible = !Physics.Linecast(transform.position, target.transform.position);
	}
}