export function bookingCreatedTemplate({ name, serviceName, employeeName, start, end }) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #eee;">

    <h2 style="color:#014d32; text-align:center; font-size: 22px; margin-bottom: 10px;">
      Varázs Szépségszalon ✨
    </h2>

    <p style="font-size: 16px; color:#333;">
      Kedves <strong>${name}</strong>! Örömmel értesítünk, hogy foglalásod rögzítettük! 💚
    </p>

    <div style="background:#f6fff9; padding:15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #014d32;">
      <p style="margin: 6px 0; font-size: 15px;">
        <strong>Szolgáltatás:</strong> ${serviceName}
      </p>
      <p style="margin: 6px 0; font-size: 15px;">
        <strong>Időpont:</strong> ${start}
      </p>
      <p style="margin: 6px 0; font-size: 15px;">
        <strong>Dolgozó:</strong> ${employeeName}
      </p>
    </div>

    <p style="font-size: 14px; color:#555;">
      Foglalásod jelenleg <strong>jóváhagyásra vár</strong>.  
      Hamarosan visszajelzést küldünk róla! 📩
    </p>

    <p style="font-size: 14px; color:#999; text-align:center; margin-top: 25px;">
      Üdvözlettel, <br />
      A Varázs Szépségszalon csapata 💐
    </p>
  </div>`;
}

export function newBookingNotificationTemplate({
  userName,
  userEmail,
  serviceName,
  employeeName,
  start,
  end
}) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; background:#ffffff;
              border-radius:12px; padding:20px; border:1px solid #eee;">

    <h2 style="color:#014d32; text-align:center; font-size:22px; margin:0 0 10px;">
      Új foglalás érkezett 🔔
    </h2>

    <p style="font-size:15px; color:#333;">
      Új időpontfoglalás történt a weboldalon!
    </p>

    <div style="background:#fff7e6; padding:15px; border-radius:8px; 
                border-left:4px solid #d98f00; margin:20px 0;">
      <p style="margin:6px 0; font-size:15px;">
        <strong>Ügyfél:</strong> ${userName} (${userEmail})
      </p>
      <p style="margin:6px 0; font-size:15px;">
        <strong>Szolgáltatás:</strong> ${serviceName}
      </p>
      <p style="margin:6px 0; font-size:15px;">
        <strong>Dolgozó:</strong> ${employeeName}
      </p>
      <p style="margin:6px 0; font-size:15px;">
        <strong>Kezdés:</strong> ${start}
      </p>
      <p style="margin:6px 0; font-size:15px;">
        <strong>Befejezés:</strong> ${end}
      </p>
    </div>

    <p style="font-size:14px; color:#444; text-align:center;">
      Foglalás státusza: <strong>jóváhagyásra vár</strong> ⏳
    </p>

    <p style="font-size:14px; color:#999; text-align:center; margin-top:25px;">
      Üdv,<br/>A Varázs Szépségszalon rendszer 🤖
    </p>
  </div>`;
}

export function bookingApprovedTemplate({ name, serviceName, employeeName, start, end }) {
  return `
  <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff;
              border-radius:12px; padding:20px; border:1px solid #eee;">
    <h2 style="color:#014d32; text-align:center;">Foglalás jóváhagyva ✔</h2>

    <p>Kedves <strong>${name}</strong>! Örömmel értesítünk, hogy a foglalásod jóváhagyásra került! 🎉</p>

    <div style="background:#f0fff3; padding:15px; border-radius:8px;
                border-left:4px solid #28a745; margin:20px 0;">
      <p><strong>Szolgáltatás:</strong> ${serviceName}</p>
      <p><strong>Időpont:</strong> ${start}</p>
      <p><strong>Dolgozó:</strong> ${employeeName}</p>
    </div>

    <p style="font-size:14px;">Várunk sok szeretettel! 💚</p>
  </div>`;
}

export function bookingRejectedTemplate({ name, serviceName, employeeName, start }) {
  return `
  <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff;
              border-radius:12px; padding:20px; border:1px solid #eee;">
    <h2 style="color:#8b0000; text-align:center;">Foglalás elutasítva ❌</h2>

    <p>Kedves <strong>${name}</strong>!</p>
    <p>Sajnos a foglalásod a következő időpontra nem került jóváhagyásra:</p>

    <div style="background:#fff1f0; padding:15px; border-radius:8px;
                border-left:4px solid #b30000; margin:20px 0;">
      <p><strong>Szolgáltatás:</strong> ${serviceName}</p>
      <p><strong>Időpont:</strong> ${start}</p>
      <p><strong>Dolgozó:</strong> ${employeeName}</p>
    </div>

    <p style="font-size:14px;">
      Amennyiben szeretnéd, szívesen segítünk másik időpontot találni! 💐
    </p>
  </div>`;
}


