package at.htl;

import io.smallrye.common.annotation.Blocking;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logmanager.Logger;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@ApplicationScoped
public class SimpleMqttReceiver {
    private Logger logger = Logger.getLogger(SimpleMqttReceiver.class.getName());

    @Incoming("measurements")
    @Blocking
    public void receiveMeasurement(byte[] byteArray) {
        String messageString = new String(byteArray);
        logger.info("Received raw message: " + messageString);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(messageString);

            long timestamp = jsonNode.get("timestamp").asLong();
            double value = jsonNode.get("value").asDouble();

            //logger.info("Timestamp: " + timestamp);
            //logger.info("Value: " + value);

            insertMeasurement(timestamp, value);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    @Blocking
    public void insertMeasurement(long timestamp, double value) {
        Measurement measurement = new Measurement();
        measurement.timestamp = timestamp;
        measurement.value = value;
        measurement.persist();
        logger.info("Insert successful");
    }

}
