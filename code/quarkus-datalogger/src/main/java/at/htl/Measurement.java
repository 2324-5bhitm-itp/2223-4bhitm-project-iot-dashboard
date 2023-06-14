package at.htl;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Measurement extends PanacheEntity {
    public long timestamp;
    public double value;
}
