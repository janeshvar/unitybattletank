var gameTimer : float = 120.0;
// Game timer in seconds


var gameTimerTextScale : float = 1.5;
var GUICustomSkin : GUISkin;


// This script should monitor for the number of tanks alive, as well as allow the tanks to ping() to get
// the position of the other tanks.
// This script should also be in charge of watching the game timer and ending the game when it hits 0.
function Update () {
	gameTimer -= Time.deltaTime;
	
	if(gameTimer <= 0)
		Application.LoadLevel("GameOver");
}


function OnGUI() {
	if (GUICustomSkin)
		GUI.skin = GUICustomSkin;
	// Transform matrix for (trasform, rotate, scale) - This just allows automatic scaling for everything that uses this matrix
	// Setting GUI.matrix to some other value will only affect the GUI stuff below it
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * gameTimerTextScale);
	
	var minutes : int = gameTimer / 60;
	var seconds : int = gameTimer - (60 * minutes);
	var timerGUI : String = minutes.ToString() + ":" + seconds.ToString();
	GUI.Label(Rect(10, 10, 50, 50), timerGUI, "MenuText");
	
}