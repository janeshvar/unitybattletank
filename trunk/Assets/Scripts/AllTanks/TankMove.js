var maxMoveSpeed : float = 5;
var rotateSpeed : float = 0.05;
var accelerateSpeed : float = 2.5;

var currentSpeed : float = 0.0;





function FixedUpdate () {
	// In theory, either the AI script or the player will call:
	// MoveForward(), RotateRight() or RotateLeft()
	// This is just used to update the tank's current position
	transform.position += currentSpeed * Time.deltaTime * transform.forward;
	
}




function MoveForward() {
	currentSpeed += Time.deltaTime * accelerateSpeed;
	currentSpeed = UClamp(currentSpeed, maxMoveSpeed);
}


function RotateLeft() {
	transform.Rotate(0, -rotateSpeed, 0);
}


function RotateRight() {
	transform.Rotate(0, rotateSpeed, 0);
}






// Clamp to upper value
function UClamp(value : float, clamp : float) : float {
	if(value < clamp)
		return value;
	else
		return clamp;
}

// Clamp to lower value
function LClamp(value : float, clamp : float) : float {
	if(value > clamp)
		return value;
	else
		return clamp;
}