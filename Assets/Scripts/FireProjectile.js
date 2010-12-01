var CannonBall : GameObject;
var speed = 8.5;

function ShootCannon ()
{
    var cannonBallClone : GameObject = Instantiate(CannonBall, transform.position, transform.rotation);
    cannonBallClone.rigidbody.velocity = transform.forward * speed;
}

function Update ()
{
    if (Input.GetButtonDown("Fire1") || Input.GetButtonDown("Jump")) {
        ShootCannon();
    }
}