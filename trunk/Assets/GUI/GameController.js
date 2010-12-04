@script ExecuteInEditMode()

var gameTimer : float = 120.0;
// Game timer in seconds


var gameTimerTextScale : float = 1.5;
var playerNameTextScale : float = 1.0;
var playerScoreTextScale : float = 1.0;
var tank1 : GameObject;
var tank2 : GameObject;
private var tankDamage1 : TankDamage = tank1.GetComponent("TankDamage");
private var tankDamage2 : TankDamage;
var GUICustomSkin : GUISkin;


// This script should monitor for the number of tanks alive, as well as allow the tanks to ping() to get
// the position of the other tanks.
// This script should also be in charge of watching the game timer and ending the game when it hits 0.
function Update () {
	gameTimer -= Time.deltaTime;
	
	if(gameTimer <= 0)
		Application.LoadLevel("GameOver");
}

function OnLoad() {
	//tankDamage1 = tank1.GetComponent("TankDamage");
	tankDamage2 = tank2.GetComponent("TankDamage");
}


function OnGUI() {
	if (GUICustomSkin)
		GUI.skin = GUICustomSkin;
	// Transform matrix for (trasform, rotate, scale) - This just allows automatic scaling for everything that uses this matrix
	// Setting GUI.matrix to some other value will only affect the GUI stuff below it
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * gameTimerTextScale);
	
	var minutes : int = gameTimer / 60;
	var seconds : int = gameTimer - (60 * minutes);
	var timerGUI : String = minutes.ToString() + ":";
	if(seconds < 10) {
		timerGUI = timerGUI + "0" + seconds.ToString();
	} else {
		timerGUI = timerGUI + seconds.ToString();
	}
	GUI.Label(Rect(5, 10, 50, 50), timerGUI, "MenuText");
	
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * playerNameTextScale);
	var tankDamage11 : TankDamage;
	tankDamage11 = tank1.GetComponent("TankDamage");
	var p1Health : String = "Health: " + tankDamage11.health;
	var p1Score : String = "Score: ";
	//var p2Health : String = "Health: " + tankDamage2.health;
	var p2Score : String = "Score: ";
	GUI.Label(Rect(5, 100, 50, 50), "Player 1", "MenuText");
	GUI.Label(Rect(5, 120, 50, 50), p1Health, "MenuText");
	GUI.Label(Rect(5, 140, 50, 50), p1Score, "MenuText");
	GUI.Label(Rect(5, 250, 50, 50), "Player 2", "MenuText");
	//GUI.Label(Rect(5, 270, 50, 50), p2Health, "MenuText");
	GUI.Label(Rect(5, 290, 50, 50), p2Score, "MenuText");
	
}