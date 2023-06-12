package at.htl;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logmanager.Logger;


@ApplicationScoped
public class SimpleMqttReceiver {
    private Logger logger = Logger.getLogger(SimpleMqttReceiver.class.getName());

    @Incoming("measurements")
    public void receiveMeasurement(byte[] byteArray) {
        String messageString = new String(byteArray);
        logger.info("Received raw message: " + messageString);
    }
}
