private var moveSpeed : float = 1.0;
private var rotateSpeed : float = 130.0;
private var gravity = 100.0;
private var moveDirection : Vector3 = Vector3.zero;
private var charController : CharacterController;

function Start()
{
    charController = GetComponent(CharacterController);
}


function Update ()
{
	var previousY : float = transform.position.y;
	
	if (Input.GetButtonDown("Fire1") || Input.GetButtonDown("Jump")) {
        GetComponent(FireProjectile).ShootCannon();
    }
	
	// Rotate about the Y axis
	transform.eulerAngles.y += Input.GetAxis("Horizontal")*(Time.deltaTime * rotateSpeed);

	// Move forward in direction the tank is facing
	moveDirection = Vector3(0,0, Input.GetAxis("Vertical"));
	moveDirection = transform.TransformDirection(moveDirection);

	// Keep clamped to the level grid
    // moveDirection.y -= gravity * Time.deltaTime;
    
    charController.Move(moveDirection * (Time.deltaTime * moveSpeed));
    
    
    transform.position.y = previousY;
}